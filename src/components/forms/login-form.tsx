"use client";

import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, LoginInput } from '@/services/validations/auth';

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-center gap-4 shadow-2xl p-5 w-full">
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
        {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
      </div>

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
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </button>
      <p>Ainda não possui uma conta? <Link href="/signup" className="font-bold text-blue-700 hover:underline">Cadastre-se já</Link></p>
    </form>
  );
}