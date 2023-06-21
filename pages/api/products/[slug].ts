import type { NextApiRequest, NextApiResponse } from 'next';

import { IProduct } from '../../../interfaces';
import { db } from '../../../database';
import { Product } from '../../../models';

type Data = 
| { message: string }
| IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    switch (req.method) {
        case 'GET':
            return getProductBySlg( req, res );
        default:
            return res.status(400).json({ message: 'Bad Request'})
    }
}

const getProductBySlg = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { slug } = req.query;
    try {
        db.connect();
        const product = await Product.findOne({ slug }).lean();
        db.disconnect();
        if ( !product ) {
           return res.status(404).json({message: `Producto con slug: ${ slug } no encontrado.`})
        }
        res.status(200).json( product )
    } catch (error) {
        db.disconnect();
        return res.status(500).json({message: 'Algo salió mal. Mirar server logs'})
    }
}
