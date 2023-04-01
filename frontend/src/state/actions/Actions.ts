import { Token, User, UserWithToken } from "../../types/Users";

export const setUser = (payload: User | null) => ({ type: "SET_USER", payload });
export const setToken = (payload: Token | null) => ({ type: "SET_TOKEN", payload });
export const setUserToken = (payload: UserWithToken | null) => ({ type: "SET_USER_TOKEN", payload });
export const clearState = () => ({ type: "CLEAR_STATE" });