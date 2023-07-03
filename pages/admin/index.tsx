import { useEffect, useState } from 'react';
import useSwr from 'swr';

import { Grid, Typography } from '@mui/material'
import { AccessTimeOutlined, AttachMoneyOutlined, CancelPresentationOutlined, CategoryOutlined, CreditCardOffOutlined, CreditCardOutlined, DashboardOutlined, GroupOutlined, ProductionQuantityLimitsOutlined } from '@mui/icons-material'

import { SummaryTile } from '@/components/admin'
import { AdminLayout } from '@/components/layouts'
import { DashboardSummaryResponse } from '@/interfaces';

const DashboardPage = () => {

  const { data, error } = useSwr<DashboardSummaryResponse>('/api/admin/dashboard', {
    refreshInterval: 30 * 1000
  });

  const [refreshIn, setrefreshIn] = useState(30);

  useEffect(() => {
    const interval = setInterval( () => {
      setrefreshIn( refreshIn => refreshIn > 0 ? refreshIn - 1: 30)
    }, 1000);
  
    return () => clearInterval(interval);
  }, [])
  

  if ( !error && !data ) {
    return <></>
  }

  if ( error ) {
    console.log(error)
    return <Typography>Error al cargar la data</Typography>
  }

  const {
    numberOfOrders,
    paidOrders,
    notPaidOrders,
    numberOfClients,
    numberOfProducts,
    productsWithNotInventory,
    lowInventory,
  } = data!;

  return (
    <AdminLayout
        title='Dashboard'
        subTitle='Estadisticas generales'
        icon={ <DashboardOutlined /> }
    >
        <Grid container spacing={ 2 } className='fadeIn'>

          <SummaryTile 
            title={ numberOfOrders }
            subTitle='Ordenes totales'
            icon={ <CreditCardOutlined color='secondary' sx={{ fontSize: 40 }}/> }
          />
          
          <SummaryTile 
            title={ paidOrders }
            subTitle='Ordenes pagadas'
            icon={ <AttachMoneyOutlined color='success' sx={{ fontSize: 40 }}/> }
          />
          
          <SummaryTile 
            title={ notPaidOrders }
            subTitle='Ordenes penditentes'
            icon={ <CreditCardOffOutlined color='error' sx={{ fontSize: 40 }}/> }
          />
          
          <SummaryTile 
            title={ numberOfClients }
            subTitle='Clientes'
            icon={ <GroupOutlined color='primary' sx={{ fontSize: 40 }}/> }
          />
          
          <SummaryTile 
            title={ numberOfProducts }
            subTitle='Productos'
            icon={ <CategoryOutlined color='warning' sx={{ fontSize: 40 }}/> }
          />
          
          <SummaryTile 
            title={ productsWithNotInventory }
            subTitle='Sin existencia'
            icon={ <CancelPresentationOutlined color='error' sx={{ fontSize: 40 }}/> }
          />

          <SummaryTile 
            title={ lowInventory }
            subTitle='Bajo inventario'
            icon={ <ProductionQuantityLimitsOutlined color='warning' sx={{ fontSize: 40 }}/> }
          />
          
          <SummaryTile 
            title={ refreshIn }
            subTitle='Actuualización en:'
            icon={ <AccessTimeOutlined color='secondary' sx={{ fontSize: 40 }}/> }
          />

        </Grid>
    </AdminLayout>
  )
}

export default DashboardPage