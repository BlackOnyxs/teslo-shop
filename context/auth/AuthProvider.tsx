import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Cookies from 'js-cookie';

import { AuthContext, authReducer } from './';
import { IUser } from '../../interfaces';
import { tesloApi } from '../../api';
import { useRouter } from 'next/router';

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
    const { data, status } = useSession();
    
    const { reload } = useRouter();

    useEffect(() => {
      if ( status === 'authenticated' ) {
        dispatch({ type: '[Auth] - Login', payload: data?.user as IUser });
      }
        
    }, [data, status]);
    

    // useEffect(() => {
    //     checkToken();
    // }, []);
    
    const checkToken = async() => {
        if ( !Cookies.get('token') ) return;
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

    const logout = () => {
        Cookies.remove('cart');
        Cookies.remove('firstName'),
        Cookies.remove('lastname'),
        Cookies.remove('address'),
        Cookies.remove('address2'),
        Cookies.remove('zip'),
        Cookies.remove('city'),
        Cookies.remove('country'),
        Cookies.remove('phone'),

        signOut();
        // Cookies.remove('token');
        // reload();
    }

    return (
        <AuthContext.Provider value={{
            ...state,

            loginUser,
            registerUser,
            logout,
        }}>
            { children }
        </AuthContext.Provider>
    );
}