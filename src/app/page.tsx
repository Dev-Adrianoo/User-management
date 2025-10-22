import { redirect } from 'next/navigation';

export default function Home() {

  const isLoggedIn = false;
  if (!isLoggedIn) {
    redirect('/login');
  }

  return (
    <main className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-5xl font-bold">Dashboard</h1>
      <p className="mt-4 text-lg">Bem-vindo, usuário autenticado!</p>
    </main>
  );
}
