import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../../context/auth';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';

interface FormData {
    email: string
    password: string
}
  
  
const LoginPage = () => {
    const { replace, query } = useRouter();
    const { loginUser } = useContext( AuthContext );
    const { register, handleSubmit, formState: { errors }} = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    
    const onLoginUser = async( { email, password }: FormData ) => {
        setShowError(false);

        const isValidLoging = await loginUser( email, password );

        if ( !isValidLoging ) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        const destination = query.p?.toString() || '/';
        replace( destination )
    }
    
    return (
        <AuthLayout title='Ingresar'>
            <form onSubmit={ handleSubmit( onLoginUser )} noValidate>

                <Box sx={{ width: 350, padding: '10px 20px'}} >
                    <Grid container spacing={ 2 }>
                        <Grid item xs={ 12 }>
                            <Typography>Iniciar Sesión</Typography>

                            <Chip 
                                label='No reconocemos ese usuario / contraseña'
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        
                        <Grid item xs={ 12 }>
                            <TextField  
                                label='Correo' 
                                type='email' 
                                variant='filled' 
                                fullWidth
                                { ...register('email', {
                                    required: 'Este campo es requerido',
                                    validate: validations.isEmail
                                })}
                                error={ !!errors.email }
                                helperText={ errors.email?.message }
                            />
                        </Grid>
                        
                        <Grid item xs={ 12 }>
                            <TextField  
                                label='Contraseña' 
                                type='password' 
                                variant='filled' 
                                fullWidth
                                { ...register('password', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 6, message: 'ninimo 6 caracteres'}
                                })}
                                error={ !!errors.password }
                                helperText={ errors.password?.message }
                            />
                        </Grid>
                        
                        <Grid item xs={ 12 }>
                            <Button 
                                type='submit'
                                color='secondary' 
                                className='circular-btn' 
                                size='large' 
                                fullWidth
                            >
                                Ingresar
                            </Button>
                        </Grid>   
                        <Grid item xs={ 12 } display='flex' justifyContent='end'>
                            <NextLink 
                                href={query.p ?`/auth/register?p=${query.p}` : '/auth/register'}
                                passHref 
                                legacyBehavior
                                
                            >
                                <Link underline='always'>
                                    ¿No tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>   

                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default LoginPage