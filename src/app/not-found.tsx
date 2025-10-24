"use client";

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center p-2 min-h-screen min-w-full">
      <h1 className="text-4xl">404</h1>
      <p className="text-2xl">Página não encontrada!</p>
      <hr className="w-70 mt-3 mb-1" />
      <Link href="/singin" className="text-base text-blue-500">Voltar para login</Link>
    </div>
  )
}