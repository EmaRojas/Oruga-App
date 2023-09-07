import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { ButtonGroup } from '@mui/material';
import logoImage from '../logo.png'; 

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user } = UserAuth();
  const logout = () => {
    return signOut(auth)
  }
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <AppBar position="static">
      <Toolbar sx={{ flexWrap: 'wrap' }}>

      <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <Avatar
            variant="square"
            alt="Logo"
            src={logoImage}
            sx={{
              marginRight: 2,
              display: { xs: 'none', md: 'flex' },
            }}
            style={{ width: '100px', height: 'auto' }}
          />
        </Link>

        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleOpenNavMenu}
            color="inherit"
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorElNav}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
            sx={{
              display: { xs: 'block', md: 'none' },
            }}
          >
                  <ButtonGroup
        orientation="vertical"
        aria-label="vertical contained button group"
        variant="text"
      >
               <Button
            href='/home'
            onClick={handleCloseNavMenu}
            variant="text"
          >
            Home
          </Button>
          <Button href='/client'
            onClick={handleCloseNavMenu}
           variant='text'
          >
            Clientes
          </Button>
          <Button href='/membership'
            onClick={handleCloseNavMenu}
           variant='text'
          >
            Membresías
          </Button>
          <Button href='/room'
            onClick={handleCloseNavMenu}
           variant='text'
          >
            Salas
          </Button>
          <Button href='/reservation'
            onClick={handleCloseNavMenu}
           variant='text'
          >
            Reservas
          </Button>
          <Button href='/usage'
            onClick={handleCloseNavMenu}
           variant='text'
          >
            Consumos
          </Button>
          <Button href='/payment'
            onClick={handleCloseNavMenu}
           variant='text'
          >
            Pagos
          </Button>
          <Button href='/availability'
            onClick={handleCloseNavMenu}
           variant='text'
          >
            Disponibilidad
          </Button>
          </ButtonGroup>
          </Menu>
        </Box>

        <Avatar
            variant="square"
            alt="Logo"
            src={logoImage}
            
            component="a"
            sx={{
              
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              color: 'inherit',
              textDecoration: 'none',
            }}
            style={{ width: '30px', height: 'auto', padding: '8px' }}
          />

        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          
        </Typography>
        

        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button
            href='/home'
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Home
          </Button>
          <Button href='/client'
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Clientes
          </Button>
          <Button href='/membership'
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Membresías
          </Button>
          <Button href='/room'
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Salas
          </Button>
          <Button href='/reservation'
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Reservas
          </Button>
          <Button href='/usage'
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Consumos
          </Button>
          <Button href='/payment'
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Pagos
          </Button>
          <Button href='/availability'
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            Disponibilidad
          </Button>
        </Box>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar alt={user.displayName} src="/static/images/avatar/2.jpg" />
            </IconButton>
          </Tooltip>
          <Menu
            sx={{ mt: '45px' }}
            id="menu-appbar"
            anchorEl={anchorElUser}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
          >
            <MenuItem onClick={logout}>
              <Typography textAlign="center">Cerrar sesión</Typography>
            </MenuItem>

          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
export default ResponsiveAppBar;