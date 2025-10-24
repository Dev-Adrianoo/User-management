import UserTable from '@/components/features/users/user-table';

export default function UsersPage() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Users</h1>
      <UserTable />
    </div>
  );
}
