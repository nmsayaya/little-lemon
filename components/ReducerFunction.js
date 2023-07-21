import { useReducer } from "react"

export const INITIAL_STATE = {
    isLoading: true, 
    firstName: null,
    email: null,
    userToken: null,
}

export const stateReducer = (state, action) => {
    switch (action.type) {
        case 'RETRIEVE_TOKEN':
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
            };
        case 'SIGNIN':
            return {
                ...state,
                userToken: action.token,
                isLoading: false,
                firstName: action.firstName,
                email: action.email,
            };
        case 'SIGNOUT':
            return {
                ...state,
                isLoading: false,
                firstName: null,
                email: null,
                userToken: null,
            };
    
        default:
            state;
    }
}