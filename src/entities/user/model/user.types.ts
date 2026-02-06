export type User = {
  id: string;
  name: string;
  avatar: string;
  createdAt: string;
};

export type CreateUserDto = {
  name: string;
  avatar: string;
};

export type UpdateUserDto = {
  name: string;
  avatar: string;
};
