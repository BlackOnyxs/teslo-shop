import { db } from '@/database';
import { User } from '@/models';
import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs';
import { jwt, validations } from '@/utils';

type Data = 
| { message: string }
| {
    token: string;
    user: {
        email: string,
        name: string, 
        role: string,
    }
}

export default function handler (req: NextApiRequest, res: NextApiResponse<Data>) {
    
    switch (req.method) {
        case 'POST':
            return registerUser( req, res );
        default:
            res.status(400).json({
                message: 'Bad Request'
            });
    }
}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {
    const { email = '', password = '', name = '' } = req.body;

    if ( password.lengh < 6 ) {
        return res.status(400).json({ 
            message: 'La contraseña debe ser de más de 6 caracteres.'
        });
    }

    if ( name.lenght < 3 ) {
        return res.status(400).json({ 
            message: 'El nombre ser de más de 6 caracteres.'
        });
    }

    if ( !validations.isValidEmail( email ) ) {
        return res.status(400).json({ 
            message: 'No es un correo válido.'
        });
    }

    await db.connect();
    const user = await User.findOne({ email }).lean();

    if ( user ) {
        await db.disconnect();
        return res.status(400).json({ message: 'Ya está registrado ese correo'});
    }
    
    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync( password ),
        role: 'client',
        name,
    })

    try {
        await newUser.save({ validateBeforeSave: true  });
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        })
    }

    const { _id, role } = newUser;
    const token = jwt.signToken( _id, email );

    return res.status(200).json(
        {
            token,
            user: {
                email,
                name, 
                role,
            }
        }
    )

}
