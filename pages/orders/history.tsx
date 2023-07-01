import NextLink from 'next/link';
import { GetServerSideProps, NextPage } from 'next';
import { getServerSession } from 'next-auth';

import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { authOptions } from '../api/auth/[...nextauth]';
import { ShopLayout } from '../../components/layouts';
import { IOrder } from '@/interfaces';
import { dbOrders } from '@/database';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullName', headerName: 'Nombre Completo', width: 300 },
  { 
    field: 'paid', 
    headerName: 'Pagada', 
    width: 200,
    renderCell: ( params: GridRenderCellParams ) => {
       return params.row.paid 
        ? <Chip color='success' label='Pagada' variant='outlined' />
        : <Chip color='error' label='No pagada' variant='outlined' />
    },
  },
  {
    field: 'orderId',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: ( params: GridRenderCellParams ) => (
      <NextLink href={`/orders/${ params.row.orderId }`} passHref legacyBehavior>
        <Link underline='always'>Ver orden</Link>
      </NextLink>
    )
  }
  
];


interface Props {
  orders: IOrder[];
}

const HistoryPage: NextPage<Props> = ({ orders }) => {
  // { id: 3, paid: true, fullname: 'Renso Levy'},

  const rows = orders.map( (order, index) => ({
      id: index + 1,
      fullName: `${order.shippingAddress.firstName}  ${order.shippingAddress.lastName}`,
      paid: order.isPaid,
      orderId: order._id
    })
  )

  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
        <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

        <Grid container display='flex' className='fadeIn'>
          <Grid  sx={{ height: 650, width: '100%'}}>
            <DataGrid 
              rows={ rows }
              columns={ columns }
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 }
                }
              }}
              pageSizeOptions={[5, 10, 25]}
            />
          </Grid>
        </Grid>
    </ShopLayout>
  )
}


export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session: any = await getServerSession(req, res, authOptions);

  if ( !session ) {
    return {
      redirect: {
        destination: '/auth/login?p=/orders/history',
        permanent: false,
      }
    }
  }

  const orders = await dbOrders.getOrderByUser( session.user._id );

  return {
    props: {
      orders
    }
  }
}

export default HistoryPage;