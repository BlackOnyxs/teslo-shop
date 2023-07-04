import { db } from '@/database';
import { IOrder } from '@/interfaces';
import { Order } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = 
| { message: string }
| IOrder[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getOrders( req, res );
        default:
            return res.status(200).json({ message: 'Bad Request' })
    }
    
}

const getOrders = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { page = 1, limit = 10} = req.query;
    
    await db.connect();
    const orders = await Order.find()
                    .sort({ createdAt: 'desc'})
                    .populate('user', 'name email')
                    .limit(Number(limit))
                    .skip( (Number(page) - 1) * Number(limit) ) 
                    .lean();
    await db.disconnect();
    return res.status(200).json(orders);;
}
