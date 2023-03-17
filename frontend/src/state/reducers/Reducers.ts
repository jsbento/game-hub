import { Action, State } from "../../types/State";

export const initialState: State = {
    user: null,
}

export const rootReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case "SIGN_IN":
            return { ...state, user: action.payload };
        case "SIGN_OUT":
            return { ...state, user: null };
        default:
            return state;
    }
}