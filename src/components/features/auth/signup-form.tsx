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
      const { confirmPassword, ...payload } = data;

      const response = await api.post('/api/auth/register', payload);
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-4 shadow-2xl p-5 w-full">
      <Input
        id="name"
        label="Nome"
        type="text"
        placeholder="Seu nome completo"
        required
        error={errors.name?.message}
        disabled={isSubmitting}
        {...register('name')}
      />

      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="nome@email.com"
        required
        error={errors.email?.message}
        disabled={isSubmitting}
        {...register('email')}
      />

      <Input
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

      <Input
        id="confirmPassword"
        label="Confirmar Senha"
        type="password"
        placeholder="******"
        required
        error={errors.confirmPassword?.message}
        disabled={isSubmitting}
        {...register('confirmPassword')}
      />

      <Input
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

      <div className="flex w-full gap-4">
        <Input
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
          id="cidade"
          label="Cidade"
          type="text"
          placeholder="Sua cidade"
          error={errors.cidade?.message}
          disabled={isSubmitting}
          {...register('cidade')}
        />
      </div>

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Cadastrando..."
        className="w-full"
      >
        Cadastrar
      </Button>

      <p>
        Já possui uma conta?{' '}
        <Link href="/signin" className="font-bold text-blue-700 hover:underline">
          Faça login
        </Link>
      </p>
    </form>
  );
}