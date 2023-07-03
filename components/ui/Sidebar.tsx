import { useContext, useState } from 'react'
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, Link, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined, DashboardOutlined } from '@mui/icons-material';

import { UIContext, AuthContext } from '../../context';


export const SideMenu = () => {

    const { push, asPath } = useRouter();
    const { isMenuOpen, toggleSideMenu } = useContext(UIContext);
    const { isLoggedIn, user, logout } = useContext(AuthContext);

    const [searchTerm, setSearchTerm] = useState('');

    const onSearchTerm = () => {
        if (searchTerm.trim().length === 0) return;

        navigateTo(`/search/${searchTerm}`);
    }

    const navigateTo = (url: string) => {
        toggleSideMenu();
        push(url);
    }


    return (
        <Drawer
            open={isMenuOpen}
            anchor='right'
            onClose={toggleSideMenu}
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>

                <List>
                    <ListItem>
                        <Input
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            onKeyUp={(e) => e.key === 'Enter' && onSearchTerm()}
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={onSearchTerm}
                                    >
                                        <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    {
                        isLoggedIn && (
                            <>
                                <ListItemButton>
                                    <ListItemIcon>
                                        <AccountCircleOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Perfil'} />
                                </ListItemButton>

                                <ListItemButton 
                                    onClick={() => navigateTo('/orders/history')}
                                >
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Mis Ordenes'} />
                                </ListItemButton>
                            </>
                        )

                    }


                    <ListItemButton
                        sx={{ display: { xs: '', sm: '' } }}
                        onClick={() => navigateTo('/category/men')}
                    >
                        <ListItemIcon>
                            <MaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItemButton>

                    <ListItemButton
                        sx={{ display: { xs: '', sm: '' } }}
                        onClick={() => navigateTo('/category/women')}
                    >
                        <ListItemIcon>
                            <FemaleOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItemButton>

                    <ListItemButton
                        sx={{ display: { xs: '', sm: '' } }}
                        onClick={() => navigateTo('/category/kid')}
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined />
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItemButton>

                    {
                        isLoggedIn
                            ? (
                               <ListItemButton onClick={ logout }>
                                <ListItemIcon>
                                    <LoginOutlined />
                                </ListItemIcon>
                                <ListItemText primary='Salir' />
                               </ListItemButton>
                            )
                            : (
                                <ListItemButton onClick={ () => navigateTo(`/auth/login?p=${asPath}`)}>
                                    <ListItemIcon>
                                        <VpnKeyOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ingresar'} />
                                </ListItemButton>
                            )
                    }

                    {
                        user?.role === 'admin' && (
                            <>
                                <Divider />
                                <ListSubheader>Admin Panel</ListSubheader>

                                <ListItemButton onClick={ () => navigateTo('/admin')}>
                                    <ListItemIcon>
                                        <DashboardOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Dashboard'} />
                                </ListItemButton>

                                <ListItemButton>
                                    <ListItemIcon>
                                        <CategoryOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Productos'} />
                                </ListItemButton>
                                <ListItemButton onClick={ () => navigateTo('/admin/orders')}>
                                    <ListItemIcon>
                                        <ConfirmationNumberOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={'Ordenes'} />
                                </ListItemButton>

                                <ListItemButton onClick={ () => navigateTo('/admin/users')}>
                                    <ListItemIcon>
                                        <AdminPanelSettings />
                                    </ListItemIcon>
                                    <ListItemText primary={'Usuarios'} />
                                </ListItemButton>
                            </>
                        )
                    }

                </List>
            </Box>
        </Drawer>
    )
}
