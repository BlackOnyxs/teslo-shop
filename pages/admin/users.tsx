import { useEffect, useState } from 'react';
import useSwr from 'swr';

import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { Grid, MenuItem, Select } from '@mui/material';
import { PeopleAltOutlined } from '@mui/icons-material'

import { AdminLayout } from '@/components/layouts'
import { IUser } from '@/interfaces';
import { tesloApi } from '@/api';

const UsersPage = () => {

    const { data, error } = useSwr<IUser[]>('/api/admin/users');
    const [ users, setUsers ] = useState<IUser[]>([]);

    useEffect(() => {
      if ( data ) {
        setUsers(data);
      }
    }, [data])
    

    if ( !data && !error ) return (<></>);

    const onRoleUpdated = async( userId: string, newRole: string ) => {
        
        const previousUsers = users.map( user => ({...user}));
        const updatedUsers = users.map( user => ({
            ...user,
            role: userId === user._id ? newRole : user.role
        }));

        setUsers( updatedUsers );
        try {
            await tesloApi.put('/admin/users', { id: userId, role: newRole});
        } catch (error) {
            setUsers( previousUsers );
            console.log(error);
            alert('No se pudo actualizar el rol del usuario')
        } 
    }

    const columns: GridColDef[] = [
        { field: 'email', headerName: 'Correo', width: 250},
        { field: 'name', headerName: 'Nombre completo', width: 300},
        { 
            field: 'role', 
            headerName: 'Rol', 
            width: 300,
            renderCell: ({row}: GridRenderCellParams) => {
                return (
                    <Select
                        value={ row.role }
                        label='Rol'
                        sx={{ width: '300px'}}
                        onChange={ ({ target }) => onRoleUpdated( row.id, target.value ) }
                    >
                        <MenuItem value="admin">Administrador</MenuItem>
                        <MenuItem value="client">Cliente</MenuItem>
                    </Select>
                )
            }
        },
    ];

    const rows = users!.map( user => ({
        id: user._id,
        email: user.email,
        name: user.name, 
        role: user.role
    }));
    return (
        <AdminLayout 
        title='Usuarios' 
        subTitle='Mantenimiento de usuarios'
        icon={<PeopleAltOutlined /> }
        >
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

export default UsersPage