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
import Logo from '../logo.png'; // Ruta de tu logo PNG


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

        <Typography
          variant="h6"
          noWrap
          component="a"
          href="/"
          sx={{
            mr: 2,
            display: { xs: 'none', md: 'flex' },
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          LOGO
        </Typography>

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
          </ButtonGroup>
          </Menu>
        </Box>
        <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
        <Typography
          variant="h5"
          noWrap
          component="a"
          href=""
          sx={{
            mr: 2,
            display: { xs: 'flex', md: 'none' },
            flexGrow: 1,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
          }}
        >
          LOGO
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