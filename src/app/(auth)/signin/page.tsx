"use client";

import  LoginForm  from "@/components/features/auth/login-form";
import React from "react";


export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  )
}