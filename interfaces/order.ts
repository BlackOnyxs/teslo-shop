import { ISize, IUser, ShippingAddress } from './';

export interface IOrder {
    _id?: string;
    user?: IUser | string;
    orderItems: IOrderItem[];
    shippingAddress: ShippingAddress;
    paymentResult?: string;

    numberOfItems : number;
    subTotal      : number;
    tax           : number;
    total         : number;

    isPaid: boolean;
    paidAt?: string

    transactionId?: string;
}

export interface IOrderValues {
    
}

export interface IOrderItem {
    _id      : string;
    title    : string;
    size     : ISize;
    quantity : number;
    slug     : string;
    image    : string;
    price    : number;
    gender   : string;
}