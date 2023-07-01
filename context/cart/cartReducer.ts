import { CartState } from './';
import { ICartProduct, ShippingAddress } from '@/interfaces';

type CartType = 
| { type: '[Cart] - Load cart from cookies | storage', payload: ICartProduct[] }
| { type: '[Cart] - Update products in cart', payload: ICartProduct[] }
| { type: '[Cart] - Change cart quantity', payload: ICartProduct }
| { type: '[Cart] - Remove product in cart', payload: ICartProduct }
| { type: '[Cart] - Load Address from Cookies', payload: ShippingAddress }
| { type: '[Cart] - Update Address from Cookies', payload: ShippingAddress }
| { 
    type: '[Cart] - Update Order sumary', 
    payload: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
    } 
}
| { type: '[Cart] - Order Completed' }

export const cartReducer = ( state: CartState, action: CartType): CartState => {
    switch (action.type) {
        case '[Cart] - Load cart from cookies | storage':
            return {
                ...state,
                cart: [...action.payload],
                isLoaded: true,
            }
        case '[Cart] - Update products in cart':
            return {
                ...state,
                cart: [...action.payload ]
            }
        case '[Cart] - Change cart quantity':
            return {
                ...state,
                cart: state.cart.map( product => {
                    if ( product._id !== action.payload._id ) return product;
                    if ( product.size !== action.payload.size ) return product;
                    
                    return action.payload
                })
            }
        case '[Cart] - Remove product in cart':
            return {
                ...state,
                cart: state.cart.filter( product => !(product._id === action.payload._id && product.size === action.payload.size) )
            }
        case '[Cart] - Update Order sumary':
            return {
                ...state,
                ...action.payload
            }
        case '[Cart] - Load Address from Cookies':
        case '[Cart] - Update Address from Cookies':
            return {
                ...state,
                shippingAddress: action.payload
            }
        case '[Cart] - Order Completed':
            return {
                ...state,
                cart: [],
                numberOfItems: 0,
                subTotal: 0,
                tax: 0,
                total: 0
            }
        default:
            return state;
    }
}