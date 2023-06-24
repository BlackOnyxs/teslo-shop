import React from 'react'

import { Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks/useProducts'

const KidPage = () => {
    const { products, isLoading } = useProducts('/products?gender=kid');
    return (
        <ShopLayout title={'Teslo-Shop - Kid'} pageDescription={'Encuetra los mejores productos para niños de Teslo aquí'}>
        <Typography variant='h1' component='h1'>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Para niños</Typography>

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

export default KidPage