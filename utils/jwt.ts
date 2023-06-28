import jwt from 'jsonwebtoken';

export const signToken = (_id: string, email: string ) => {

    if ( !process.env.JWT_SECRET_SEED ) throw new Error('Seed not found. Look env file')

    return jwt.sign(
        { _id, email },
        process.env.JWT_SECRET_SEED,
        { expiresIn: '1d' }
    );
}


export const isValidToken = (token: string): Promise<string> => {
    if ( !process.env.JWT_SECRET_SEED ) throw new Error('Seed not found. Look env file');

    if ( token.length < 10 ) {
        return Promise.reject('JWT no es válido')
    }
    return new Promise( (resolve, reject) => {
        try {
            jwt.verify( token, process.env.JWT_SECRET_SEED || '', (err, payload) => {
                if ( err ) return reject('JWT invalid');

                const { _id } = payload as { _id: string };
                resolve( _id )
            })
        } catch (error) {
            return reject('JWT invalid');
        }
    })
}