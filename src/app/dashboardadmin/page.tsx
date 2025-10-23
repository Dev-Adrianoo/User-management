"use client";

import DashBoardAdmin from '@/components/ui/DashBoardAdmin';
import React from 'react';

export default function DashboardAdminPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-4xl">
        <DashBoardAdmin />
      </div>
    </main>
  );
}
