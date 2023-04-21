import { Token, User } from './Users';

export type Action = {
  type: string;
  payload: any;
};

export type State = {
  user: User | null;
  token: Token | null;
};

export const Actions = {
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  SET_TOKEN: 'SET_TOKEN',
};
