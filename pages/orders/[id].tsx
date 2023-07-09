import { useState } from 'react';

import { GetServerSideProps, NextPage } from 'next'
import { useRouter } from 'next/router';

import { getServerSession } from 'next-auth';
import { PayPalButtons } from '@paypal/react-paypal-js';

import { Typography, Grid, Card, CardContent, Divider, Box, Button, Link, Chip, CircularProgress } from '@mui/material'
import { CreditCardOffOutlined, CreditScoreOutlined } from '@mui/icons-material';

import { authOptions } from '../api/auth/[...nextauth]';
import { OrderList, OrderSummary } from '../../components/cart'
import { ShopLayout } from '../../components/layouts'
import { IOrder } from '@/interfaces';

import { dbOrders } from '@/database';
import { tesloApi } from '@/api';


export type OrderResponseBody = {
    id: string;
    status:
    | "COMPLETED" 
    | "SAVED" 
    | "APPROVED" 
    | "VOIDED" 
    | "PAYER_ACTION_REQUIRED" 
    | "CREATED" 
}

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

    const { reload } = useRouter();
    const [isPaying, setIsPaying] = useState(false);

    const onOrderCompleted = async( details: OrderResponseBody ) => {

        if ( details.status !== 'COMPLETED' ) {
            return alert('No hay pago en PayPal');
        }

        setIsPaying(true);

        try {
            const { data } = await tesloApi.post(`/orders/payment`, {
                transactionId: details.id,
                orderId: _id
            });
            reload();
        } catch (error) {
            setIsPaying(false);
            console.log(error);
            alert('Error')
        }
    }

    return (
        <ShopLayout title='Resumen de la orden' pageDescription='Resumen de la orden.'>
            <Typography variant='h1' component='h1'>Orden: #{_id}</Typography>

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
                                <Box 
                                    display='flex' 
                                    justifyContent='center' 
                                    className='fadeIn'
                                    sx={{ display: isPaying ? 'flex' : 'none'}}
                                >
                                    <CircularProgress 
                                    />
                                </Box>
                                <Box  flexDirection="column" sx={{ display: isPaying ? 'none' : 'flex', flex: 1}}>
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
                                                <PayPalButtons
                                                    createOrder={(data, actions) => {
                                                        return actions.order.create({
                                                            purchase_units: [
                                                                {
                                                                    amount: {
                                                                        value: total.toString()
                                                                    }
                                                                }
                                                            ],
                                                        });
                                                    }}
                                                    onApprove={(data, actions) => {
                                                        return actions.order!.capture().then((details) => {
                                                            onOrderCompleted(details)
                                                        })
                                                    }}
                                                />
                                            )
                                    }
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </ShopLayout>
    )
}



export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {

    const { id = '' } = query;

    const session: any = await getServerSession(req, res, authOptions);

    if (!session) {
        return {
            redirect: {
                destination: `/auth/login?p=/orders/${id}`,
                permanent: false
            }
        }
    }

    const order = await dbOrders.getOrderById(id.toString() );

    if (!order) {
        return {
            redirect: {
                destination: '/orders/history',
                permanent: false,
            }
        }
    }

    if (order.user !== session.user.id) {
        return {
            redirect: {
                destination: '/orders/history',
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