import { FC, PropsWithChildren, useEffect, useReducer, useState } from 'react';
import { CartContext, cartReducer } from './';
import { ICartProduct } from '../../interfaces';
import Cookie from 'js-cookie';
export interface CartState {
    cart: ICartProduct[];
    numberOfItems: number;
    subTotal: number;
    tax: number;
    total: number;
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
    numberOfItems: 0,
    subTotal: 0,
    tax: 0,
    total: 0,
}

export const CartProvider:FC<PropsWithChildren> = ({ children }) => {

    const [state, dispatch ]= useReducer(cartReducer, CART_INITIAL_STATE);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if ( !isMounted ) {
            try {
              const cartFromCookies = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ) : [];
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
      if (isMounted) Cookie.set('cart', JSON.stringify( state.cart ) );
    }, [state.cart, isMounted]);
    

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

    return (
        <CartContext.Provider value={{
            ...state,
            addProduct,
            updateCartQuantity,
            removeCartProduct,
        }}>
            { children }
        </CartContext.Provider>
    );
}