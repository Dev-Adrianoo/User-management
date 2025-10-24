"use client";

import { useAuth } from '@/hooks/use-auth';
import DashBoardAdmin from '@/components/ui/DashBoardAdmin';
import DashBoardUser from '@/components/ui/DashBoardUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading, permissions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/singin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <main className="flex min-h-screen items-center justify-center p-24">
      <div className="w-full max-w-4xl">
        {permissions.includes('view_admin_dashboard') ? (
          <DashBoardAdmin />
        ) : permissions.includes('view_user_dashboard') ? (
          <DashBoardUser />
        ) : (
          <div>Você não tem permissão para visualizar este painel.</div>
        )}
      </div>
    </main>
  );
}