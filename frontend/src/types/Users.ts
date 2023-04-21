export type User = {
  id: string;
  username: string;
  email: string;
  roles: string[];
  friends: string[];
};

export type Token = {
  userId: string;
  roles: string[];
  token: string;
};

export type UserWithToken = {
  user: User;
  token: Token;
};
