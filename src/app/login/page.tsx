"use client";

import  LoginForm  from "@/components/LoginForm";
import React from "react";


export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
        <LoginForm />
      </div>
    </main>
  )
}