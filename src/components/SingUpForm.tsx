"use client";

import Link from 'next/link';
import React from 'react';

export default function SingUpForm() {
  return (
    <form className="flex flex-col justify-center gap-4 shadow-2xl p-5 w-full">
      <div className="w-full">
        <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Nome *</label>
        <input
          type="text"
          id="name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="Seu nome completo"
          required
        />
      </div>
      <div className="w-full">
        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Email *</label>
        <input
          type="email"
          id="email"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder="nome@email.com"
          required
        />
      </div>
      <div className="w-full">
        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-black">Senha *</label>
        <input
          type="password"
          id="password"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
          placeholder='******'
          required
        />
         <span className='text-xs text-gray-900'>Mínimo 6 caracteres, inclua letras e números</span>
      </div>
      <div className="w-full">
        <label htmlFor="cep" className='block mb-2 text-sm font-medium text-gray-900 dark:text-black'>CEP</label>
        <input
          type="number"
          id='cep'
          className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
          placeholder='00000-000'
        />
        <span className='text-xs'>Não sabe seu cep? <strong>clique aqui</strong> </span>
      </div>
      <div className="flex w-full gap-4">
        <div className="w-full">
          <label htmlFor="state" className='block mb-2 text-sm font-medium text-gray-900 dark:text-black'>Estado</label>
          <input
            type="text"
            id='state'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            placeholder='UF'
          />
        </div>
        <div className="w-full">
          <label htmlFor="city" className='block mb-2 text-sm font-medium text-gray-900 dark:text-black'>Cidade</label>
          <input
            type="text"
            id='city'
            className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
            placeholder='Sua cidade'
          />
        </div>
      </div>
      <button
        type="submit"
        className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
      >
        Cadastrar
      </button>
      <p>Já possui uma conta? <Link href="/login" className="font-bold text-blue-700">Faça login</Link></p>
    </form>
  );
}
