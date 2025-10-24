import useSWR from 'swr';
import { api } from '@/lib/api';
import { PublicUser } from '@/types/user';

const fetcher = (url: string) => api.get(url).then(res => res.data);

export function useUsers() {
  const { data, error, isLoading, mutate } = useSWR<PublicUser[]>('/api/users', fetcher);

  const createUser = async (data: Partial<PublicUser>) => {
    await api.post('/api/users', data);
    mutate();
  };

  const updateUser = async (id: string, data: Partial<PublicUser>) => {
    await api.put(`/api/users/${id}`, data);
    mutate();
  };

  const deleteUser = async (id: string) => {
    await api.delete(`/api/users/${id}`);
    mutate();
  };

  return {
    users: data,
    error,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
  };
}
