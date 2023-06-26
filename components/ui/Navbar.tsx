import { useContext, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

import { AppBar, Badge, Box, Button, IconButton, Input, InputAdornment, Link, Toolbar, Typography } from '@mui/material';
import { ClearOutlined, SearchOutlined, ShoppingBagOutlined } from '@mui/icons-material';
import { CartContext, UIContext } from '@/context';

export const Navbar = () => {

  const { asPath, push } = useRouter();

  const { toggleSideMenu } = useContext( UIContext );
  const { numberOfItems } = useContext( CartContext );
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const onSearchTerm = () => {
    if( searchTerm.trim().length === 0 ) return;
    push(`/search/${ searchTerm }`);
}

  return (
    <AppBar>
        <Toolbar>
          <NextLink href='/' passHref legacyBehavior>
            <Link display='flex' alignItems='center'>
              <Typography variant='h6'>Teslo |</Typography>
              <Typography sx={{ ml: 0.5 }}>Shop</Typography>
            </Link>
          </NextLink>

          <Box flex={ 1 } />
          
          <Box sx={{ display: isSearchVisible ? 'none' : { xs: 'none', sm: 'block' } }}
                    className="fadeIn">
            <NextLink href='/category/men' passHref legacyBehavior>
              <Link>
                <Button 
                  color={ asPath === '/category/men' ? 'primary' : 'info' }
                >
                    Hombres
                </Button>
              </Link>
            </NextLink>
            <NextLink href='/category/women' passHref legacyBehavior>
              <Link>
                <Button
                  color={ asPath === '/category/women' ? 'primary' : 'info' }
                >
                  Mujeres
                </Button>
              </Link>
            </NextLink>
            <NextLink href='/category/kid' passHref legacyBehavior>
              <Link>
                <Button
                  color={ asPath === '/category/kid' ? 'primary' : 'info' }
                >
                  Niños
                </Button>
              </Link>
            </NextLink>
          </Box>

          <Box flex={ 1 } />

          {
            isSearchVisible
              ? (
                <Input
                sx={{ display: { xs: 'none', sm: 'flex' } }}
                className='fadeIn'
                autoFocus
                value={ searchTerm }
                onChange={ (e) => setSearchTerm( e.target.value ) }
                onKeyUp={ (e) => e.key === 'Enter' && onSearchTerm() }
                type='text'
                placeholder="Buscar..."
                endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            onClick={ () => setIsSearchVisible(false) }
                        >
                            <ClearOutlined />
                        </IconButton>
                    </InputAdornment>
                }
            />
              )
            : (
              <IconButton
                onClick={ () => setIsSearchVisible( true ) }
                className='fadeIn'
                sx={{ display: { sx: 'none', sm: 'flex'}}}
              >
                <SearchOutlined />
              </IconButton>
            )
          }


          <NextLink href='/cart' passHref legacyBehavior>
            <Link>
              <IconButton>
                <Badge badgeContent={ numberOfItems > 9 ? '+9' : numberOfItems } color='secondary'>
                  <ShoppingBagOutlined/>
                </Badge>
              </IconButton>
            </Link>
          </NextLink>

          <Button
            onClick={ toggleSideMenu }
          >
            Menu
          </Button>
        </Toolbar>
    </AppBar>
  )
}
