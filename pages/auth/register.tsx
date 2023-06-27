import { useContext, useState } from 'react';
import NextLink from 'next/link';

import { Box, Button, Chip, Grid, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthContext } from '../../context/auth';
import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
import { useRouter } from 'next/router';

type FormData = {
    name    : string;
    email   : string;
    password: string;
}

const RegisterPage = () => {

    const { replace } = useRouter();
    const { registerUser } = useContext( AuthContext );

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onRegisterUser = async( { name, email, password }: FormData ) => {
        setShowError(false);

        const { hasError, message } = await registerUser( name, email, password );

        if ( hasError ) {
            setShowError(true);
            setErrorMessage( message! )
            setTimeout(() => setShowError(false), 3000);
            return;
        }
      
        replace('/')
    }

    return (
        <AuthLayout title='Registro'>
            <form onSubmit={ handleSubmit( onRegisterUser ) }>

                <Box sx={{ width: 350, padding: '10px 20px'}} >
                    <Grid container spacing={ 2 }>
                        <Grid item xs={ 12 }>
                            <Typography>Crear Cuenta</Typography>
                            <Chip 
                                label={ errorMessage }
                                color='error'
                                icon={ <ErrorOutline /> }
                                className='fadeIn'
                                sx={{ display: showError ? 'flex' : 'none' }}
                            />
                        </Grid>
                        
                        <Grid item xs={ 12 }>
                            <TextField  
                                label='Nombre' 
                                type='text' 
                                variant='filled' 
                                fullWidth
                                { ...register('name', {
                                    required: 'Este campo es requerido',
                                    minLength: { value: 3, message: 'El largo del nombre debe ser mayor a 3 caracteres.'}
                                })}
                                error={ !!errors.name }
                                helperText={ errors.name?.message }
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
                            <NextLink href='/auth/login' passHref legacyBehavior>
                                <Link underline='always'>
                                    ¿Ya tienes cuenta?
                                </Link>
                            </NextLink>
                        </Grid>   

                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export default RegisterPage