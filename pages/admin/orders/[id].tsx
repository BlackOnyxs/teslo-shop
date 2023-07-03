
import { GetServerSideProps, NextPage } from 'next'

import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip, CircularProgress } from '@mui/material'
import { AirplaneTicketOutlined, CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { OrderList, OrderSummary } from '../../../components/cart'
import { AdminLayout, ShopLayout } from '../../../components/layouts'
import { IOrder } from '@/interfaces';

import { dbOrders } from '@/database';


interface Props {
    order: IOrder
}

const OrderPage: NextPage<Props> = ({
    order: { _id, isPaid, orderItems,
        shippingAddress,
        numberOfItems,
        subTotal,
        tax,
        total }
}) => {

    return (
        <AdminLayout 
            title='Resumen de la orden' 
            subTitle={`OrderId: ${_id}`}
            icon={<AirplaneTicketOutlined />}
        >
            {
                isPaid
                    ? (
                        <Chip
                            sx={{ my: 2 }}
                            label='Pagada'
                            variant='outlined'
                            color='success'
                            icon={<CreditScoreOutlined />}
                        />
                    )
                    : (
                        <Chip
                            sx={{ my: 2 }}
                            label='Pendiente de pago'
                            variant='outlined'
                            color='error'
                            icon={<CreditCardOffOutlined />}
                        />
                    )

            }

            <Grid container className='fadeIn'>
                <Grid item xs={12} sm={7}>
                    <OrderList products={orderItems} />
                </Grid>
                <Grid item xs={12} sm={5}>
                    <Card className='summary-card'>
                        <CardContent>
                            <Typography variant='h2'>Resumen ({numberOfItems} {numberOfItems > 1 ? 'productos' : 'producto'})</Typography>
                            <Divider sx={{ my: 1 }} />

                            <Box display='flex' justifyContent='space-between'>
                                <Typography variant='subtitle1'>Dirección de entrega</Typography>
                            </Box>

                            <Typography>{shippingAddress.firstName} {shippingAddress.lastName}</Typography>
                            <Typography>{shippingAddress.address} {shippingAddress.address2 && `, ${shippingAddress.address2}`}</Typography>
                            <Typography>{shippingAddress.city}</Typography>
                            <Typography>{shippingAddress.country}</Typography>
                            <Typography>{shippingAddress.phone}</Typography>

                            <Divider sx={{ my: 1 }} />

                            <OrderSummary
                                orderValues={{ numberOfItems, subTotal, tax, total }}
                            />

                            <Box sx={{ mt: 3 }} display='flex' flexDirection='column' >

                                {
                                    isPaid
                                        ? (
                                            <Chip
                                                sx={{ my: 2, flex: 1 }}
                                                label='Pagada'
                                                variant='outlined'
                                                color='success'
                                                icon={<CreditScoreOutlined />}
                                            />
                                        )
                                        : (
                                            <Chip
                                                sx={{ my: 2, flex: 1 }}
                                                label='Pendiente de pago'
                                                variant='outlined'
                                                color='error'
                                                icon={<CreditCardOffOutlined />}
                                            />
                                        )

                                }
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </AdminLayout>
    )
}



export const getServerSideProps: GetServerSideProps = async ({ query }) => {

    const { id = '' } = query as { id: string };

    const order = await dbOrders.getOrderById(id);

    if (!order) {
        return {
            redirect: {
                destination: '/admin/orders',
                permanent: false,
            }
        }
    }

    return {
        props: {
            order
        }
    }
}

export default OrderPage