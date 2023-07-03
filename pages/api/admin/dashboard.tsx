import { db } from '@/database';
import { Order, Product, User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
    numberOfOrders: number;
    paidOrders: number;
    notPaidOrders: number;
    numberOfClients: number;
    numberOfProducts: number;
    productsWithNotInventory: number;
    lowInventory: number;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();

    const [numberOfOrders, paidOrders, notPaidOrders, numberOfClients, numberOfProducts, productsWithNotInventory, lowInventory] = await Promise.all([
        Order.count().lean(),
        Order.count({isPaid: true }),
        Order.count({isPaid: false }),
        User.count({role: 'client' }),
        Product.count(),
        Product.count({ inStock: 0}),
        Product.count({ inStock: { $lte: 10 } }),
    ]);

    await db.disconnect();
    
    res.status(200).json({
        numberOfOrders,
        paidOrders,
        notPaidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNotInventory,
        lowInventory,
    })
}