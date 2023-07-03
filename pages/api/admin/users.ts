import { db } from '@/database';
import { User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import { IUser } from '../../../interfaces/user';
import { isValidObjectId } from 'mongoose';

type Data = 
| { message: string }
| IUser[]

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
   switch (req.method) {
    case 'GET':
        return getUsers( req, res );
    case 'PUT':
        return updateUser( req, res );
    default:
        return res.status(400).json({ message: 'Bad Request'})
   }
}

const getUsers = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { page = 1, limit = 10} = req.query;

    await db.connect();
    const users = await User.find()
                .limit(Number(limit))
                .skip((Number(page ) -1) * Number(limit))    
                .select('-password')
                .lean();
    await db.disconnect();
    return res.status(200).json(users)
}
const updateUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { id = '', role = '' } = req.body;
    

    if (!isValidObjectId( id) ){
        return res.status(400).json({ message: 'No existe un usuario con ese id.'})
    }

    const validRole = ['admin', 'client'];
    if ( !validRole.includes( role ) ) {
        return res.status(401).json({ message: 'No es un rol pemitido' + role});
    }
    
    await db.connect();
    const user = await User.findById( id );
    await db.disconnect();


    if ( !user ) {
        return res.status(400).json({ message: 'Usuario no encontrado'});
    }

    user.role = role;
    await user.save();
    return res.status(200).json({ message: 'Usuario actualizado.'});
}
