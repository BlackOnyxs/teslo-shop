import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';

import { db } from '@/database';
import { IOrder } from '@/interfaces';
import { Order, Product } from '@/models';
import { authOptions } from '../auth/[...nextauth]';

type Data = 
| { message: string }
| IOrder

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return createOrder( req, res );
    
        default:
            return res.status(400).json({ message: 'Bad Request'})
    }
}

const createOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { orderItems, total } = req.body as IOrder;

    console.log(req.body)

    const session: any = await getServerSession(req, res, authOptions);
    if ( !session ) return res.status(401).json({ message: 'Debe estar autenticado'});

    const productsId = orderItems.map( p => p._id );
    await db.connect();

    const dbProducts = await Product.find({ _id:{ $in: productsId } });

    try {
        const subTotal = orderItems.reduce( (prev, current) => {
            const currentPrice = dbProducts.find( prod => prod.id === current._id)?.price;
            if ( !currentPrice ) {
                throw new Error('Verifique el carrito nuevamente, producto no existe.')
            }
            return(currentPrice * current.quantity) + prev;
        }, 0 )


        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal* (taxRate + 1 );

        if ( total !== backendTotal ) {
            throw new Error('El total no cuadra con el monto.');
        }

        const userId = session.user._id;
        const newOrder = new Order({...req.body, isPaid: false, user: userId });
        await newOrder.save()

        await db.disconnect();
        return res.status(201).json(newOrder)
    } catch (error: any) {
        await db.disconnect();
        console.log(error)
        res.status(400).json({ message: error.message || 'Revise logs del servidor'});
    }
    
    
}
