import { Grid, Typography } from '@mui/material';


export const OrderSummary = () => {
  return (
    <Grid container>
        <Grid item xs={ 6 }>
            <Typography>No. Productos</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>3 items</Typography>
        </Grid>

        <Grid item xs={ 6 }>
            <Typography>SubTotal</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>$200</Typography>
        </Grid>

        <Grid item xs={ 6 }>
            <Typography>Impuesto</Typography>
        </Grid>
        <Grid item xs={ 6 } display='flex' justifyContent='end'>
            <Typography>$35</Typography>
        </Grid>

        <Grid item xs={ 6 } sx={{ mt: 2 }}>
            <Typography variant='subtitle1'>Total</Typography>
        </Grid>
        <Grid item sx={{ mt: 2 }} xs={ 6 } display='flex' justifyContent='end'>
            <Typography variant='subtitle1'>$235</Typography>
        </Grid>

    </Grid>
  )
}
