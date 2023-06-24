import { useContext, useState } from 'react'
import { useRouter } from 'next/router';

import { Box, Divider, Drawer, IconButton, Input, InputAdornment, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from '@mui/material'
import { AccountCircleOutlined, AdminPanelSettings, CategoryOutlined, ConfirmationNumberOutlined, EscalatorWarningOutlined, FemaleOutlined, LoginOutlined, MaleOutlined, SearchOutlined, VpnKeyOutlined } from '@mui/icons-material'

import { UIContext } from '../../context';


export const SideMenu = () => {

    const { push } = useRouter();
    const { isMenuOpen, toggleSideMenu} = useContext( UIContext);

    const [searchTerm, setSearchTerm] = useState('');

    const onSearchTerm = () => {
        if ( searchTerm.trim().length === 0 ) return;

        navigateTo(`/search/${ searchTerm }`);
    }

    const navigateTo = ( url: string ) => {
        toggleSideMenu();
        push(url);
    }

    return (
        <Drawer
            open={ isMenuOpen }
            anchor='right'
            onClose={ toggleSideMenu }
            sx={{ backdropFilter: 'blur(4px)', transition: 'all 0.5s ease-out' }}
        >
            <Box sx={{ width: 250, paddingTop: 5 }}>
                
                <List>
                    <ListItem>
                        <Input
                            value={ searchTerm }
                            onChange={ e =>  setSearchTerm( e.target.value )}
                            onKeyUp={ (e) => e.key === 'Enter' && onSearchTerm() }
                            type='text'
                            placeholder="Buscar..."
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={ onSearchTerm }
                                    >
                                    <SearchOutlined />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </ListItem>

                    <ListItemButton>
                        <ListItemIcon>
                            <AccountCircleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Perfil'} />
                    </ListItemButton>

                    <ListItemButton>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Mis Ordenes'} />
                    </ListItemButton>


                    <ListItemButton 
                        sx={{ display: { xs: '', sm: '' } }}
                        onClick={ () => navigateTo('/category/men')}
                    >
                        <ListItemIcon>
                            <MaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Hombres'} />
                    </ListItemButton>

                    <ListItemButton 
                        sx={{ display: { xs: '', sm: '' } }}
                        onClick={ () => navigateTo('/category/women')}
                    >
                        <ListItemIcon>
                            <FemaleOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Mujeres'} />
                    </ListItemButton>

                    <ListItemButton 
                        sx={{ display: { xs: '', sm: '' } }}
                        onClick={ () => navigateTo('/category/kid')}
                    >
                        <ListItemIcon>
                            <EscalatorWarningOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Niños'} />
                    </ListItemButton>


                    <ListItemButton>
                        <ListItemIcon>
                            <VpnKeyOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Ingresar'} />
                    </ListItemButton>

                    <ListItemButton>
                        <ListItemIcon>
                            <LoginOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Salir'} />
                    </ListItemButton>


                    {/* Admin */}
                    <Divider />
                    <ListSubheader>Admin Panel</ListSubheader>

                    <ListItemButton>
                        <ListItemIcon>
                            <CategoryOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Productos'} />
                    </ListItemButton>
                    <ListItemButton>
                        <ListItemIcon>
                            <ConfirmationNumberOutlined/>
                        </ListItemIcon>
                        <ListItemText primary={'Ordenes'} />
                    </ListItemButton>

                    <ListItemButton>
                        <ListItemIcon>
                            <AdminPanelSettings/>
                        </ListItemIcon>
                        <ListItemText primary={'Usuarios'} />
                    </ListItemButton>
                </List>
            </Box>
        </Drawer>
    )
}
