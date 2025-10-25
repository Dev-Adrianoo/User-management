"use client";

import Link from 'next/link';
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from "@/hooks/use-auth";
import { loginSchema, LoginInput } from '@/lib/schemas/auth.schema';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { LockKeyhole, LogIn, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { containerVariantsStagger, itemVariantsFadeInUp } from '@/lib/animation';


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
    <motion.form
      variants={containerVariantsStagger}
      initial="hidden"
      animate="visible"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center gap-4 shadow-2xl p-5 w-120 h-112 rounded-lg">
      <motion.h1 variants={itemVariantsFadeInUp} className='text-3xl font-semibold'>Bem-vindo de volta</motion.h1>
      <motion.p variants={itemVariantsFadeInUp} className='font-light'>Acesse sua conta para continuar.</motion.p>

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
        disabled={isSubmitting}
        {...register('password')}
      />
      </motion.div>

      <motion.div variants={itemVariantsFadeInUp}>
      <Button
        type="submit"
        isLoading={isSubmitting}
        loadingText="Entrando..."
        className="w-full"
      >
        <LogIn className="mr-2 h-5 w-5" />
        Entrar
      </Button>
      </motion.div>
    
      <motion.p variants={itemVariantsFadeInUp} className='text-center'>
        Ainda não possui uma conta?{' '}
        <Link href="/signup" className="font-bold text-blue-700 hover:underline">
          Cadastre-se já
        </Link>
      </motion.p>
    </motion.form>
  );
}