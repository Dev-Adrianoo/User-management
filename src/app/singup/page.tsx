"use client";

import SingUpForm from "@/components/SingUpForm";
import React from "react";

export default function SingUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>
        <SingUpForm />
      </div>
    </main>
  )
}