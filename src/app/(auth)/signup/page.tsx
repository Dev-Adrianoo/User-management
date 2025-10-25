"use client";

import SignUpForm from "@/components/features/auth/signup-form";
import React from "react";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-10">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </main>
  )
}