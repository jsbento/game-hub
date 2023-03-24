import { Action, State } from "../../types/State";

export const initialState: State = {
    user: null,
    token: null,
}

export const rootReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case "SIGN_IN":
            return { ...state, user: action.payload };
        case "SIGN_OUT":
            return { ...state, user: null };
        case "SET_TOKEN":
            return { ...state, token: action.payload };
        default:
            return state;
    }
}