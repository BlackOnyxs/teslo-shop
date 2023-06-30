import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next'
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { Box, Button, Chip, Divider, Grid, IconButton, Link, TextField, Typography } from '@mui/material';
import { ErrorOutline, GitHub } from '@mui/icons-material';
import { useForm } from 'react-hook-form';

import { AuthLayout } from '../../components/layouts';
import { validations } from '../../utils';
import { getSession, signIn, getProviders } from 'next-auth/react';

interface FormData {
    email: string
    password: string
}
  
  
const LoginPage = () => {
    const { replace, query } = useRouter();
    const { register, handleSubmit, formState: { errors }} = useForm<FormData>();
    const [showError, setShowError] = useState(false);

    const [providers, setProviders] = useState<any>({});

    useEffect(() => {
      getProviders().then( prov => {
        setProviders(prov);
      })
    }, [])
    
    
    const onLoginUser = async( { email, password }: FormData ) => {
        setShowError(false);

        // const isValidLoging = await loginUser( email, password );

        // if ( !isValidLoging ) {
        //     setShowError(true);
        //     setTimeout(() => setShowError(false), 3000);
        //     return;
        // }
        // const destination = query.p?.toString() || '/';
        // replace( destination )
        await signIn('credentials', { email, password });
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

                        <Grid item xs={ 12 } display='flex' flexDirection='column' justifyContent='end'>
                            <Divider sx={{ width: '100%', mb: 2 }}/>
                            {
                                Object.values( providers ).map(( provider: any) => {
                                    if ( provider.id === 'credentials' ) return (<div key='credentials'></div>);
                                    return (
                                        <Button
                                            key={ provider.id }
                                            variant='outlined'
                                            fullWidth
                                            color='primary'
                                            sx={{ mb: 1 }}
                                            startIcon={ <GitHub />}
                                            onClick={() => signIn( provider.id )}
                                        >
                                            { provider.name }
                                        </Button>
                                    )
                                })
                            }
                        </Grid>
                    </Grid>
                </Box>
            </form>
        </AuthLayout>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, query }) => {
    
    const session = await getSession({ req });

    const { p = '/' } = query;

    if ( session ) {
        return { 
            redirect: {
                destination: p.toString(),
                permanent: false
            }
        }
    }

    return {
        props: {
            
        }
    }
}
export default LoginPage