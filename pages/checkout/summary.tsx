import { useContext } from 'react';
import NextLink from 'next/link';

import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link } from '@mui/material'

import { CartContext } from '@/context';
import { ShopLayout } from '../../components/layouts'
import { OrderList, OrderSummary } from '../../components/cart'
import { countries } from '@/utils';


const SummaryPage = () => {

    const { shippingAddress, numberOfItems } = useContext( CartContext );

    if ( !shippingAddress ) {
        return (<></>);
    }

    const { firstName, lastname, address, address2, zip, city, country, phone } = shippingAddress;
    return (
        <ShopLayout title='Resumen de orden' pageDescription='Resumen de la orden.'>
            <Typography variant='h1' component='h1'>Resumen de la orden</Typography>
    
            <Grid container>
                <Grid item xs={ 12 } sm={ 7 }>
                    <OrderList  />
                </Grid>
                <Grid item xs={ 12 } sm={ 5 }>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} { numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link>Editar</Link>
                                </NextLink>
                            </Box>

                            <Typography>{firstName} {lastname}</Typography>
                            <Typography>{address} {address2 ? `, ${address2}`: ''}</Typography>
                            <Typography>{city} {zip}</Typography>
                            <Typography>{ countries.find( c => c.code === country )?.name }</Typography>
                            <Typography>+507 {phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='end'>
                                <NextLink href='/cart' passHref legacyBehavior>
                                    <Link>Editar</Link>
                                </NextLink>
                            </Box>

                            <OrderSummary />
    
                            <Box sx={{ mt: 3}}>
                                <Button color='secondary' className='circular-btn' fullWidth>
                                    Confirmar Orden
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
      )
}

export default SummaryPage