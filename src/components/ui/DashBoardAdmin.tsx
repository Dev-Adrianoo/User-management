"use client"
import React from 'react';

export default function DashBoardAdmin() {
  return (
    <div>
      <h2 className="text-2xl font-bold">Painel do Administrador</h2>
      <p>Bem-vindo, admin!</p>
      <p>Gerenciamento de Usuários</p>
      <div className='border p-4'>
        <section className=''>
          <div className="overflow-x-auto">
            <table className='w-full border-collapse'>
              <thead>
                <tr>
                  <th className="border p-2 text-left">Nome</th>
                  <th className="border p-2 text-left">E-mail</th>
                  <th className="border p-2 text-left">CEP</th>
                  <th className="border p-2 text-left">Endereço</th>
                  <th className="border p-2 text-left">Ações</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Joao Silva</td>
                  <td className="border p-2">joao@example.com</td>
                  <td className="border p-2">12345-678</td>
                  <td className="border p-2">Rua A, 123</td>
                  <td className="border p-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">EDITAR</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">DELETAR</button>
                  </td>
                </tr>
                <tr>
                  <td className="border p-2">Maria Santos</td>
                  <td className="border p-2">maria@example.com</td>
                  <td className="border p-2">87654-321</td>
                  <td className="border p-2">Av. B, 456</td>
                  <td className="border p-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2">EDITAR</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded">DELETAR</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
