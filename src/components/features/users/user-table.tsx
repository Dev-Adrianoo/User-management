'use client';

import { useUsers } from '@/hooks/use-users';
import { Button } from '@/components/ui/button';
import { PublicUser } from '@/types/user';

export default function UserTable() {
  const { users, isLoading, error } = useUsers();

  if (isLoading) return <div className="text-center p-4">Loading users...</div>;
  if (error) return <div className="text-center p-4 text-red-500">Failed to load users.</div>;
  if (!users || users.length === 0) return <div className="text-center p-4">No users found.</div>;

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left p-4 font-medium">Nome</th>
            <th className="text-left p-4 font-medium">Email</th>
            <th className="text-left p-4 font-medium">Role</th>
            <th className="text-left p-4 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: PublicUser) => (
            <tr key={user.id} className="border-b hover:bg-gray-50">
              <td className="p-4">{user.nome}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'ADMIN' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                  {user.role}
                </span>
              </td>
              <td className="p-4">
                <Button variant="outline" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
