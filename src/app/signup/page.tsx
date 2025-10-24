"use client";

import SignUpForm from "@/components/forms/signup-form";
import React from "react";

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Cadastro</h1>
        <SignUpForm />
      </div>
    </main>
  )
}