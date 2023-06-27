import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';

export interface AuthState {
    isLoggedIn: boolean;
    user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
    isLoggedIn: false,
    user: undefined,
}

export const AuthProvider:FC<PropsWithChildren> = ({ children }) => {

    const [state, dispatch ] = useReducer(authReducer, AUTH_INITIAL_STATE);

    useEffect(() => {
        checkToken();
    }, []);
    
    const checkToken = async() => {
        try {
            const { data: { token, user } } = await tesloApi.get('/user/validate-token');
            Cookies.set('token', token );
            dispatch({ type: '[Auth] - Login', payload: user });
        } catch (error) {
            console.log(error);
            Cookies.remove('token');
        }

    }

    const loginUser = async ( email:string, password: string ): Promise<boolean> => {
        try {
            const { data: { token, user } } = await tesloApi.post('/user/login', { email, password } );
            Cookies.set('token', token );
            dispatch( { type: '[Auth] - Login', payload: user } );
            return true;
        } catch (error) {
            return false;
        }
    }

    const registerUser =async ( name:string, email: string, password: string ): Promise<{hasError: boolean, message?: string}> => {
        try {
            const { data: { token, user } } = await tesloApi.post('/user/register', { name, email, password } );
            Cookies.set('token', token );
            dispatch( { type: '[Auth] - Login', payload: user } );
            return {
                hasError: false
            }
        } catch (error) {
            if ( axios.isAxiosError( error ) ){
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }

            return {
                hasError: true,
                message: 'No se pudo crear el usuario - Intente de nuevo.'
            }
        }
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            loginUser,
            registerUser,
        }}>
            { children }
        </AuthContext.Provider>
    );
}