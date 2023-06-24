import type { NextApiRequest, NextApiResponse } from 'next'

import { db } from '../../../database';
import { Product } from '../../../models';
import { IProduct } from '../../../interfaces';

type Data = 
| { message: string }
| IProduct[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return searcProduct(req, res );
    
        default:
            return res.status(400).json({ message: 'Bad Request'})
    }
}

const searcProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    let { q = '' } = req.query;
    if ( q.length === 0 ) {
        return res.status(400).json({ message: 'Debe especificar el query de busqueda'});
    }
    q = q.toString().toLowerCase();

    try {
       await db.connect();
        const products = await Product.find({
            $text: { $search: q }
        })
        .select('title images price inStock slug -_id')
        .lean();
    await db.disconnect();
        return res.status(200).json( products );
    } catch (error) {
        await db.disconnect();
        return res.status(500).json({message: 'Algo salió mal. Mirar server logs'})
    }
    
}
