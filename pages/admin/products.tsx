import NextLink from 'next/link';
import useSwr from 'swr';

import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid"
import { CategoryOutlined } from "@mui/icons-material"
import { Box, Button, CardMedia, Grid, Link } from "@mui/material"

import { AdminLayout } from "@/components/layouts"
import { IProduct } from "@/interfaces";


const columns: GridColDef[] = [
  { 
    field: 'img', 
    headerName: 'Foto',
    renderCell: ({row}: GridRenderCellParams) => {
      return (
        <a href={`/product/${row.slug}`} target='_blank' rel='noreferrer'>
          <CardMedia 
            component='img'
            alt={ row.title }
            className='fadeIn'
            image={ row.img}
          />
        </a>
      )
    }
  },
  { 
    field: 'title', 
    headerName: 'Title', 
    width: 300,
    renderCell: ({row}: GridRenderCellParams) => {
      return (
        <NextLink href={`/admin/products/${ row.slug }`} passHref legacyBehavior>
          <Link>
            { row.title}
          </Link>
        </NextLink>
      )
    }
  },
  { field: 'gender', headerName: 'Género' },
  { field: 'type', headerName: 'Tipo' },
  { field: 'inStock', headerName: 'Inventario' },
  { field: 'price', headerName: 'Precio' },
  { field: 'sizes', headerName: 'Tallas' },
]


const ProductsPage = () => {
  const { data, error } = useSwr<IProduct[]>('/api/admin/products');

  if ( !data && !error ) return <></>;

  const rows = data!.map( product => ({
    id: product._id,
    img: product.images[0],
    title: product.title,
    gender: product.gender,
    type: product.type,
    inStock: product.inStock,
    price: product.price,
    sizes: product.sizes.join(', '),
    slug: product.slug,
  }))

  return (
    <AdminLayout 
      title={`Productos (${ data?.length })`}
      subTitle='Mantenimiento de productos'
      icon={ <CategoryOutlined /> }
    >
      <Box display='flex' justifyContent='end' sx={{ mb: 2}}>
        <Button 
          startIcon={ <CategoryOutlined /> }
          color='secondary'
          href='/admin/products/new'
        >
          Crear Producto
        </Button>

      </Box>
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
    </AdminLayout>
  )
}

export default ProductsPage