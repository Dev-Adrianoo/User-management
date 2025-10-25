"use client";

import Link from 'next/link';
import React, { useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import { useCep } from '@/hooks/use-cep';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema, SignupData } from '@/lib/schemas/auth.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isAxiosError } from 'axios';
import { Building, LockKeyhole, Mail, MapPin, UserPlus, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariantsStagger, itemVariantsFadeInUp } from '@/lib/animation';

export default function SignupForm() {
  const { fetchCep, isLoading: isCepLoading } = useCep();

  const resolver = zodResolver(signupSchema) as unknown as Resolver<SignupData>;

  const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch, trigger, setError } = useForm<SignupData>({
    resolver,
    mode: 'onBlur',
  });

  const cepValue = watch('cep');

  const handleCepSearch = useCallback(async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    const data = await fetchCep(cleanCep);
    if (data) {
      setValue('estado', data.uf, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      setValue('cidade', data.localidade, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
      toast.success("Endereço preenchido automaticamente!");
      trigger(['estado', 'cidade']);
    }
  }, [fetchCep, setValue, trigger]);

  useEffect(() => {
    if (cepValue && cepValue.replace(/\D/g, '').length === 8) {
      handleCepSearch(cepValue);
    }
  }, [cepValue]);

  const onSubmit = async (data: SignupData) => {
    try {

      const response = await api.post('/api/auth/register', data);
      localStorage.setItem('token', response.data.token);
      toast.success('Cadastro realizado com sucesso!');

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);

    } catch (error) {
      if (isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        if (responseData?.errors && Array.isArray(responseData.errors)) {
          responseData.errors.forEach((err: { field: string; message: string }) => {
            setError(err.field as keyof SignupData, { type: 'manual', message: err.message });
          });
          toast.error('Erro de validação. Verifique os campos.');
        } else {
          const message = responseData?.error || 'Erro ao cadastrar';
          toast.error(message);
        }
      } else {
        toast.error('Ocorreu um erro inesperado.');
        console.error(error);
      }
    }
  };



  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center gap-4 shadow-2xl p-5 w-120 rounded-lg"
      variants={containerVariantsStagger}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 variants={itemVariantsFadeInUp} className='text-3xl font-semibold'>Crie sua conta</motion.h1>
      <motion.p variants={itemVariantsFadeInUp} className='font-light'>Preencha os dados abaixo para começar.</motion.p>

      <motion.div variants={itemVariantsFadeInUp}>
        <Input
          icon={<UserRound className='h-5 w-5 text-gray-400' />}
          id="name"
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          required
          error={errors.name?.message}
          disabled={isSubmitting}
          {...register('name')}
        />
      </motion.div>

      <motion.div variants={itemVariantsFadeInUp}>
        <Input
          icon={<Mail className='h-5 w-5 text-gray-400' />}
          id="email"
          label="Email"
          type="email"
          placeholder="seu@email.com"
          required
          error={errors.email?.message}
          disabled={isSubmitting}
          {...register('email')}
        />
      </motion.div>


      <motion.div variants={itemVariantsFadeInUp}>
        <Input
          icon={<LockKeyhole className='h-5 w-5 text-gray-400' />}
          id="password"
          label="Senha"
          type="password"
          placeholder="******"
          required
          error={errors.password?.message}
          helperText={!errors.password && "Mínimo 8 caracteres, inclua letras e números"}
          disabled={isSubmitting}
          {...register('password')}
        />
      </motion.div>

      <motion.div variants={itemVariantsFadeInUp}>
        <Input
          icon={<LockKeyhole className='h-5 w-5 text-gray-400' />}
          id="confirmPassword"
          label="Confirmar Senha"
          type="password"
          placeholder="******"
          required
          error={errors.confirmPassword?.message}
          disabled={isSubmitting}
          {...register('confirmPassword')}
        />
      </motion.div>

      <motion.div variants={itemVariantsFadeInUp}>
        <Input
          icon={<MapPin className='h-5 w-5 text-gray-400' />}
          id="cep"
          label="CEP"
          type="text"
          placeholder="00000-000"
          maxLength={9}
          error={errors.cep?.message}
          helperText={
            !errors.cep && (
              <>
                Não sabe seu CEP?{' '}
                <a
                  href="https://buscacepinter.correios.com.br/app/endereco/index.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-blue-700 hover:underline"
                >
                  Clique aqui
                </a>
              </>
            )
          }
          disabled={isSubmitting || isCepLoading}
          {...register('cep', {
            onChange: (e) => {
              let value = e.target.value.replace(/\D/g, '');
              if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
              }
              setValue('cep', value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
            },
          })}
        />
      </motion.div>


      <motion.div
        variants={itemVariantsFadeInUp}
        className="flex w-full gap-4">
        <Input
          icon={<Building className='h-5 w-5 text-gray-400' />}
          id="estado"
          label="Estado"
          type="text"
          placeholder="UF"
          maxLength={2}
          error={errors.estado?.message}
          disabled={isSubmitting}
          {...register('estado')}
        />


        <Input
          icon={<Building className='h-5 w-5 text-gray-400' />}
          id="cidade"
          label="Cidade"
          type="text"
          placeholder="Sua cidade"
          error={errors.cidade?.message}
          disabled={isSubmitting}
          {...register('cidade')}
        />
      </motion.div>

      <motion.div
        variants={itemVariantsFadeInUp}
      >
        <Button
          type="submit"
          isLoading={isSubmitting}
          loadingText="Cadastrando..."
          className="w-full"
        >
          <UserPlus className="mr-2 h-5 w-5" />
          Cadastrar
        </Button>
      </motion.div>

      <motion.p variants={itemVariantsFadeInUp} className='text-center'>
        Já possui uma conta?{' '}
        <Link href="/signin" className="font-bold text-blue-700 hover:underline">
          Faça login
        </Link>
      </motion.p>
    </motion.form>
  );
}
