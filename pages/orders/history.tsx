import NextLink from 'next/link';

import { Chip, Grid, Link, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import { ShopLayout } from '../../components/layouts';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'fullname', headerName: 'Nombre Completo', width: 300 },
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
    field: 'order',
    headerName: 'Ver orden',
    width: 200,
    sortable: false,
    renderCell: ( params: GridRenderCellParams ) => (
      <NextLink href={`/orders/${ params.row.id }`} passHref legacyBehavior>
        <Link underline='always'>Ver orden</Link>
      </NextLink>
    )
  }
  
];

const rows = [
  { id: 1, paid: true, fullname: 'Robin Avila'},
  { id: 2, paid: false, fullname: 'Eleicer Guevara'},
  { id: 3, paid: true, fullname: 'Renso Levy'},
]

const HistoryPage = () => {
  return (
    <ShopLayout title='Historial de ordenes' pageDescription='Historial de ordenes del cliente'>
        <Typography variant='h1' component='h1'>Historial de ordenes</Typography>

        <Grid container>
          <Grid xs={12} sx={{ height: 650, width: '100%'}}>
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

export default HistoryPage;