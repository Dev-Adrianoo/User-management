"use client";

import Link from 'next/link';
import React from 'react';

export default function LoginForm() {
  return (
    <form className="flex flex-col justify-center gap-4 shadow-2xl p-5 w-full">
      <div className="w-full">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email</label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="nome@email.com"
          required
          />
      </div>
      <div className="w-full">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Senha</label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder='******'
          required
          />
      </div>
      <button
        type="submit"
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
        >
        Entrar
      </button>
      <p>Ainda não possui uma conta? <Link href="/singup" className="font-bold text-blue-700">Cadastre-se já</Link></p>
    </form>
  );
}
