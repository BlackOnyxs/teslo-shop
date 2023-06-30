import { useRouter } from 'next/router';

import { ShopLayout } from '../../components/layouts';
import { Box, Button, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import Cookies from 'js-cookie';

import { countries } from '../../utils/';
import { useForm } from 'react-hook-form';
import { ShippingAddress } from '@/interfaces';
import { useContext, useEffect } from 'react';
import { CartContext } from '@/context';



const getAddressFromCookies = (): ShippingAddress => {
    return {
        firstName: Cookies.get('firstName') || '',
        lastName : Cookies.get('lastName') || '',
        address  : Cookies.get('address') || '',
        address2 : Cookies.get('address2') || '',
        zip      : Cookies.get('zip') || '',
        city     : Cookies.get('city') || '',
        country  : Cookies.get('country') || '',
        phone    : Cookies.get('phone') || '',
    }
}

const AddressPage = () => {
    const { push } = useRouter();
    const { updateAddress } = useContext( CartContext );

    const { register, handleSubmit, formState: { errors }, reset } = useForm<ShippingAddress>({
        defaultValues: {
            firstName: '',
            lastName: '',
            address: '',
            address2: '',
            zip: '',
            city: '',
            country: countries[0].code,
            phone: '',
        }
    });

    useEffect(() => {
        reset(getAddressFromCookies() );

    }, [reset])

    const onSaveAddress = (data: ShippingAddress) => {
        updateAddress( data );
        push('/checkout/summary');
    }

    return (
        <ShopLayout title='Dirección' pageDescription='Confirmar dirección del destino'>
            <Typography variant='h1' component='h1'>Dirección</Typography>
            <form onSubmit={handleSubmit(onSaveAddress)}>
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Nombre'
                            variant='filled'
                            fullWidth
                            {...register('firstName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 3, message: 'El nombre debe ser mayor a 6 caracteres' }
                            })}
                            error={!!errors.firstName}
                            helperText={errors.firstName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Apellidos'
                            variant='filled'
                            fullWidth
                            {...register('lastName', {
                                required: 'Este campo es requerido',
                                minLength: { value: 3, message: 'El apellido debe ser mayor a 6 caracteres' }
                            })}
                            error={!!errors.lastName}
                            helperText={errors.lastName?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección'
                            variant='filled'
                            fullWidth
                            {...register('address', {
                                required: 'Este campo es requerido',
                                minLength: { value: 6, message: 'La dirección debe ser mayor a 6 caracteres' }
                            })}
                            error={!!errors.address}
                            helperText={errors.address?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Dirección 2'
                            variant='filled'
                            fullWidth
                            {...register('address2', {
                                minLength: { value: 6, message: 'La dirección debe ser mayor a 6 caracteres' }
                            })}
                            error={!!errors.address2}
                            helperText={errors.address2?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Código Postal'
                            variant='filled'
                            fullWidth
                            {...register('zip', {
                                required: 'Este campo es requerido'
                            })}
                            error={!!errors.zip}
                            helperText={errors.zip?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Ciudad'
                            variant='filled'
                            fullWidth
                            {...register('city', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.city}
                            helperText={errors.city?.message}
                        />
                    </Grid>

                    <Grid item xs={12} sm={ 6 }>
                    {/* <FormControl fullWidth> */}
                        <TextField
                            // select
                            variant="filled"
                            label="País"
                            fullWidth
                            // defaultValue={ Cookies.get('country') || countries[0].code }
                            { ...register('country', {
                                required: 'Este campo es requerido'
                            })}
                            error={ !!errors.country }
                            helperText={ errors.country?.message }
                        />
                            {/* {
                                countries.map( country => (
                                    <MenuItem 
                                        key={ country.code }
                                        value={ country.code }
                                    >{ country.name }</MenuItem>
                                ))
                            }
                        </TextField> */}
                    {/* </FormControl> */}
                </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label='Teléfono'
                            variant='filled'
                            fullWidth
                            {...register('phone', {
                                required: 'Este campo es requerido',
                            })}
                            error={!!errors.phone}
                            helperText={errors.phone?.message}
                        />
                    </Grid>
                </Grid>


                <Box sx={{ mt: 5 }} display='flex' justifyContent='center'>
                    <Button
                        color='secondary'
                        className='circular-btn'
                        size='large'
                        type='submit'
                    >
                        Revisar Pedido
                    </Button>
                </Box>
            </form>
        </ShopLayout>
    )
}



export default AddressPage