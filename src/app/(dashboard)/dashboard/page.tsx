"use client";

import { useAuth } from '@/hooks/use-auth';
import DashBoardAdmin from '@/components/features/dashboard/admin-dashboard';
import  DashBoardUser  from '@/components/features/dashboard/user-dashboard'; 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, isLoading, permissions } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/signin');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <p>Carregando...</p>
      </div>
    );
  }

  if (!user) {
    return null; 
  }

  return (
    <div className="w-full">
      {permissions.includes('view_admin_dashboard') ? (
        <DashBoardAdmin />
      ) : permissions.includes('view_user_dashboard') ? (
        <DashBoardUser user={user} /> 
      ) : (
        <div className="p-8">
          Você não tem permissão para visualizar este painel.
        </div>
      )}
    </div>
  );
}