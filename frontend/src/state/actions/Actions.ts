import { Token, User } from "../../types/Users";

export const setUser = (payload: User | null) => ({ type: "SET_USER", payload });
export const setToken = (payload: Token | null) => ({ type: "SET_TOKEN", payload });