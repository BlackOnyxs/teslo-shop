import { NextPage } from 'next';
import { useSession } from 'next-auth/react';

import { Typography } from '@mui/material';

import { ShopLayout } from '../components/layouts';
import { ProductList } from '../components/products';
import { FullScreenLoading } from '../components/ui';
import { useProducts } from '../hooks';


const Home:NextPage = () => {

  

  const { products, isLoading } = useProducts('/products');
  return (
    <ShopLayout title={'Teslo-Shop - Home'} pageDescription={'Encuetra los mejores productos de Teslo aquí'}>
      <Typography variant='h1' component='h1'>Tienda</Typography>
      <Typography variant='h2' sx={{ mb: 1 }}>Todos los productos</Typography>

      {
        isLoading
        ? <FullScreenLoading />
        : (
            <ProductList 
              products={ products }
            />
        )
      }

    </ShopLayout>
  )
}

export default Home;
