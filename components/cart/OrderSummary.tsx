import { FC, useContext } from 'react';

import { Grid, Typography } from '@mui/material';

import { CartContext } from '@/context';
import { currency } from '@/utils';

interface Props {
    orderValues?: {
        numberOfItems: number;
        subTotal: number;
        tax: number;
        total: number;
    }
}

export const OrderSummary:FC<Props> = ({ orderValues }) => {
    const {numberOfItems, subTotal, tax, total } = useContext( CartContext );

    const summaryValue = orderValues ? orderValues : {numberOfItems, subTotal, tax, total };

    
    return (
        <Grid container>
            <Grid item xs={ 6 }>
                <Typography>No. Productos</Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end'>
                <Typography>{ summaryValue.numberOfItems } { summaryValue.numberOfItems > 1 ? 'productos' : 'producto'}</Typography>
            </Grid>

            <Grid item xs={ 6 }>
                <Typography>SubTotal</Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end'>
                <Typography>{currency.format(summaryValue.subTotal)}</Typography>
            </Grid>

            <Grid item xs={ 6 }>
                <Typography>Impuestos ({Number(Number(process.env.NEXT_PUBLIC_TAX_RATE) * 100).toFixed(2)})%</Typography>
            </Grid>
            <Grid item xs={ 6 } display='flex' justifyContent='end'>
                <Typography>{currency.format(summaryValue.tax)}</Typography>
            </Grid>

            <Grid item xs={ 6 } sx={{ mt: 2 }}>
                <Typography variant='subtitle1'>Total</Typography>
            </Grid>
            <Grid item sx={{ mt: 2 }} xs={ 6 } display='flex' justifyContent='end'>
                <Typography variant='subtitle1'>{currency.format(summaryValue.total)}</Typography>
            </Grid>

        </Grid>
    )
}
