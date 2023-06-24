import type { NextApiRequest, NextApiResponse } from 'next';

import { db, SHOP_CONSTANTS } from '../../../database';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces';

type Data = 
| { message: string }
| IProduct[]

export default function (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'GET':
            return getProducts( req, res );
    
        default:
            return res.status(400).json({ message: 'Metodo no encontrado.'});
    }
}

const getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>)  => {
    
    const { gender = 'all' } = req.query;

    let condition = {};

    if ( gender !== 'all' && SHOP_CONSTANTS.validGenders.includes(`${gender}`) ) {
        condition = { gender };
    }
     
    try {
        await db.connect();
        const products = await Product.find(condition)
                                    .select(['title', 'price', 'inStock', 'slug', 'images', '-_id'])
                                    .lean();
        await db.connect();
        return res.status(200).json(products);
    } catch (error) {
        await db.connect();
        return res.status(500)
    }
}
