import { User } from "../../types/Users";

export const setUser = (payload: User | null) => ({ type: "SET_USER", payload })