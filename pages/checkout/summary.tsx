import NextLink from 'next/link';
import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link } from '@mui/material'

import { OrderList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'


const SummaryPage = () => {
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
                            <Typography variant='h2'>Resumen</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                            <Typography variant='subtitle1'>Dirección de entrega</Typography>
                                <NextLink href='/checkout/address' passHref legacyBehavior>
                                    <Link>Editar</Link>
                                </NextLink>
                            </Box>

                            <Typography>Robin Avila</Typography>
                            <Typography>Santiago</Typography>
                            <Typography>Santiago, Veraguas</Typography>
                            <Typography>Panamá</Typography>
                            <Typography>+507 67890090</Typography>

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