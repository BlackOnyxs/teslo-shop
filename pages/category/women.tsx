import React from 'react'

import { Typography } from '@mui/material'

import { ShopLayout } from '../../components/layouts'
import { ProductList } from '../../components/products'
import { FullScreenLoading } from '../../components/ui'
import { useProducts } from '../../hooks/useProducts'

const WomanPage = () => {
    const { products, isLoading } = useProducts('/products?gender=women');
    return (
        <ShopLayout title={'Teslo-Shop - Woman'} pageDescription={'Encuetra los mejores productos para mujeres de Teslo aquí'}>
        <Typography variant='h1' component='h1'>Tienda</Typography>
        <Typography variant='h2' sx={{ mb: 1 }}>Para mujeres</Typography>

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

export default WomanPage