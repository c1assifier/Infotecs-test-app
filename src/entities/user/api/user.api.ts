import { api } from '../../../shared/api/axios';
import { CreateUserDto, UpdateUserDto, User } from '../model/user.types';

export const fetchUsers = async (): Promise<User[]> => {
  const response = await api.get<User[]>('/users');
  return response.data;
};

export const createUser = async (dto: CreateUserDto): Promise<User> => {
  const response = await api.post<User>('/users', dto);
  return response.data;
};

export const updateUser = async (id: string, dto: UpdateUserDto): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, dto);
  return response.data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};
