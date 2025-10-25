"use client";

import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, LoginInput } from '@/lib/schemas/auth.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginForm() {
  const { login } = useAuth();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onBlur',
  });

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data.email, data.password);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-4 shadow-2xl p-5 w-120 h-112 rounded-lg">
      <h1 className='text-3xl font-semibold'>Bem-vindo de volta</h1>
      <p className='font-light'>Acesse sua conta para continuar.</p>
      <Input
        id="email"
        label="Email"
        type="email"
        placeholder="seu@email.com"
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
        disabled={isSubmitting}
        {...register('password')}
      />

      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Entrando..."
        className="w-full"
      >
        Entrar
      </Button>

      <p className='text-center'>
        Ainda não possui uma conta?{' '}
        <Link href="/signup" className="font-bold text-blue-700 hover:underline">
          Cadastre-se já
        </Link>
      </p>
    </form>
  );
}