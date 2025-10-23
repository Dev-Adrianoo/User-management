"use client";

import Link from 'next/link';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useCep } from '@/hooks/use-cep';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupData } from '@/services/validations/auth';

export default function SignupForm() {
  const router = useRouter();
  const { fetchCep, isLoading: isCepLoading } = useCep();

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, trigger } = useForm<SignupData>({
    resolver: zodResolver(signupSchema),
    mode: 'onBlur',
  });

  const cepValue = watch('cep');

  useEffect(() => {
    if (cepValue && cepValue.replace(/\D/g, '').length === 8) {
      handleCepSearch();
    }
  }, [cepValue]);

  const handleCepSearch = async () => {
    if (!cepValue) return; 
    const cleanCep = cepValue.replace(/\D/g, '');
    if (!cleanCep || cleanCep.length !== 8) {
      toast.error('CEP inválido');
      return;
    }

    const data = await fetchCep(cleanCep);
    if (data) {
      setValue('estado', data.uf, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue('cidade', data.localidade, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      toast.success("Endereço preenchido automaticamente!");
      trigger(['estado', 'cidade']); 
    }
  };

  const onSubmit = async (data: SignupData) => {
    try {
      const payload = {
        nome: data.name,
        email: data.email,
        senha: data.password,
        cep: data.cep || undefined,
        estado: data.estado || undefined,
        cidade: data.cidade || undefined,
      };

      const response = await api.post('/api/auth/register', payload);

      toast.success('Cadastro realizado com sucesso!');

      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');

    } catch (error: any) {
      const message = error.response?.data?.error || 'Erro ao cadastrar';
      toast.error(message);

    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-4 shadow-2xl p-5 w-full">
      <div className="w-full">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
          Nome <span className='text-orange-700'>*</span>
        </label>
        <input
          type="text"
          id="name"
          {...register('name')}
          className={`bg-gray-50 border ${errors.name ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="Seu nome completo"
          disabled={isSubmitting}
        />
        {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
      </div>
      <div className="w-full">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
          Email <span className='text-orange-700'>*</span>
        </label>
        <input
          type="email"
          id="email"
          {...register('email')}
          className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder="nome@email.com"
          disabled={isSubmitting}
        />
      </div>
      {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
      <div className="w-full">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
          Senha <span className='text-orange-700'>*</span>
        </label>
        <input
          type="password"
          id="password"
          {...register('password')}
          className={`bg-gray-50 border ${errors.password ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder='******'
          disabled={isSubmitting}
        />
        {errors.password && <span className="text-xs text-red-500 mt-1">{errors.password.message}</span>}
        {!errors.password && (
          <span className='text-xs text-gray-600'>Mínimo 8 caracteres, inclua letras e números</span>
        )}
      </div>

      <div className="w-full">
        <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">
          Confirmar Senha <span className='text-orange-700'>*</span>
        </label>
        <input
          type="password"
          id="confirmPassword"
          {...register('confirmPassword')}
          className={`bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`}
          placeholder='******'
          disabled={isSubmitting}
        />
        {errors.confirmPassword && <span className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</span>}
      </div>

      <div className="w-full">
        <label htmlFor="cep" className='block mb-2 text-sm font-medium text-gray-900 dark:text-black'>CEP</label>
        <input
          type="text"
          id='cep'
          {...register('cep', {
            onChange: (e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
              }
              setValue('cep', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            },
          })}
          className={`bg-gray-50 border ${errors.cep ? 'border-red-500' : 'border-gray-300'} text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:focus:border-blue-500 block w-full p-2.5`}
          placeholder='00000-000'
          maxLength={9}
          disabled={isSubmitting || isCepLoading}
        />
        
        {errors.cep && <span className="text-xs text-red-500 mt-1">{errors.cep.message}</span>}
        {!errors.cep && (
          <span className='text-xs text-gray-600'>
            Não sabe seu CEP?{' '}
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-blue-700 hover:underline"
            >
              Clique aqui
            </a>
          </span>
        )}
      </div>
      <div className="flex w-full gap-4">
        <div className="w-full">
          <label htmlFor="estado" className='block mb-2 text-sm font-medium text-gray-900 dark:text-black'>Estado</label>
          <input
            type="text"
            id='estado'
            {...register('estado')}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            placeholder='UF'
            maxLength={2}
            disabled={isSubmitting}
          />
          {errors.estado && <span className="text-xs text-red-500 mt-1">{errors.estado.message}</span>}
        </div>
        <div className="w-full">
          <label htmlFor="cidade" className='block mb-2 text-sm font-medium text-gray-900 dark:text-black'>Cidade</label>
          <input
            type="text"
            id='cidade'
            {...register('cidade')}
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            placeholder='Sua cidade'
            disabled={isSubmitting}
          />
          {errors.cidade && <span className="text-xs text-red-500 mt-1">{errors.cidade.message}</span>}
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"

      >
        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}

      </button>
      <p>Já possui uma conta? 
        <Link href="/login" className="font-bold text-blue-700 hover:underline">
        Faça login
        </Link>
        </p>
    </form>
  );
}
