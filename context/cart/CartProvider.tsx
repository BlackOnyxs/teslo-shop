import { FC, PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import Cookies from 'js-cookie';
import { tesloApi } from '@/api';
import axios from 'axios';

export interface CartState {
    isLoaded: boolean;
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
    shippingAddress?: ShippingAddress;
}

const CART_INITIAL_STATE: CartState = {
    isLoaded: false,
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
    shippingAddress: undefined,
}

export const CartProvider:FC<PropsWithChildren> = ({ children }) => {

    const [state, dispatch ]= useReducer(cartReducer, CART_INITIAL_STATE);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if ( !isMounted ) {
            try {
              const cartFromCookies = Cookies.get('cart') ? JSON.parse( Cookies.get('cart')! ) : [];
              dispatch({ type: '[Cart] - Load cart from cookies | storage', payload: cartFromCookies })
            } catch (error) {
              dispatch({ type: '[Cart] - Load cart from cookies | storage', payload: [] })
            }
            setIsMounted(true);
        }
    }, [isMounted])

    useEffect(() => {
        const numberOfItems = state.cart.reduce( ( prev, current ) => current.quantity + prev, 0);
        const subTotal = state.cart.reduce( ( prev, current ) => (current.price * current.quantity ) + prev, 0 );
        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const orderSummary = {
          numberOfItems, 
          subTotal,
          tax: subTotal * taxRate,
          total: subTotal * ( taxRate + 1)
        }
        dispatch({type: '[Cart] - Update Order sumary', payload: orderSummary});
    }, [state.cart]);
    
    

    useEffect(() => {
      if (isMounted) Cookies.set('cart', JSON.stringify( state.cart ) );
    }, [state.cart, isMounted]);

    useEffect(() => {
      if ( !isMounted ) {
        if ( Cookies.get('firstName') ) {
            const shippingAddress: ShippingAddress = {
                firstName: Cookies.get('firstName') || '',
                lastName : Cookies.get('lastName') || '',
                address  : Cookies.get('address') || '',
                address2 : Cookies.get('address2') || '',
                zip      : Cookies.get('zip') || '',
                city     : Cookies.get('city') || '',
                country  : Cookies.get('country') || '',
                phone    : Cookies.get('phone') || '',
            }
            dispatch({ type: '[Cart] - Load Address from Cookies', payload: shippingAddress})
        }
      }
    }, [isMounted])
    
    

    const addProduct = ( product: ICartProduct ) => {
        const productInCart = state.cart.some( p => p._id === product._id && p.size === product.size );

        if ( !productInCart ) return dispatch({ type: '[Cart] - Update products in cart', payload: [...state.cart, product ]});
        const updatedProducts = state.cart.map( p => {
            if ( p._id !== product._id ) return p;
            if ( p.size !== product.size ) return p;
            p.quantity += product.quantity;
            return p;
        })
        dispatch({ type: '[Cart] - Update products in cart', payload: updatedProducts });
    }

    const updateCartQuantity = ( product: ICartProduct ) => {
        dispatch({ type: '[Cart] - Change cart quantity', payload: product });
    }

    const removeCartProduct = ( product: ICartProduct ) => {
        dispatch({type: '[Cart] - Remove product in cart', payload: product })
    }

    const updateAddress = ( address: ShippingAddress ) => {
        Cookies.set('firstName', address.firstName),
        Cookies.set('lastname', address.lastName),
        Cookies.set('address', address.address),
        Cookies.set('address2', address.address2 || ''),
        Cookies.set('zip', address.zip),
        Cookies.set('city', address.city),
        Cookies.set('country', address.country),
        Cookies.set('phone', address.phone),
        dispatch({ type: '[Cart] - Update Address from Cookies', payload: address });
    }


    const createOrder = async(): Promise<{ hasError: boolean, message: string}> => {

        if ( !state.shippingAddress ) {
            throw new Error('No hay dirección de entrega');
        }

        const body: IOrder = {
            orderItems: state.cart.map( p => ({
                ...p,
                size: p.size!
            })),
            shippingAddress: state.shippingAddress,
            numberOfItems: state.numberOfItems,
            subTotal: state.subTotal,
            tax: state.tax,
            total: state.total,
            isPaid: false
        }

        try {
            
            const { data } = await tesloApi.post('/orders', body);
            Cookies.remove('cart');
            dispatch({ type: '[Cart] - Order Completed'});

            return {
                hasError: false,
                message: data._id
            }

        } catch (error) {
            if ( axios.isAxiosError(error) ) {
                return {
                    hasError: true,
                    message: error.response?.data.message
                }
            }
            return {
                hasError: true,
                message: 'Error no contralado. Hable con el administrador.'
            }
        }
    }

    return (
        <CartContext.Provider value={{
            ...state,
            addProduct,
            updateCartQuantity,
            removeCartProduct,
            updateAddress,
            createOrder,
        }}>
            { children }
        </CartContext.Provider>
    );
}