import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Button, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { LogoutOutlined, MenuOutlined } from '@mui/icons-material';
import { startLogout } from '../../store/auth/thunks';


export const NavBar = () => {

    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(startLogout());
    }

    const { displayName } = useSelector(state => state.auth);
    return (
        <AppBar
            position='fixed'

        >
            <Toolbar>

                <IconButton
                    color='inherit'
                    edge="start"
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >

                    <MenuOutlined />
                </IconButton>



                <Grid container direction='row' justifyContent='space-between' alignItems='center'>
                    <Typography variant='h6' noWrap component='div'> OrugaApp </Typography>



                    <Button color='error' onClick={onLogout} variant="outlined" startIcon={<LogoutOutlined />}>   <Typography color='white' variant='h7' component='div'>
                        {displayName}
                    </Typography> </Button>
                    {/* <IconButton 
                    color='error'
                    onClick={ onLogout }
                >
                    <LogoutOutlined />
                </IconButton> */}

                </Grid>

            </Toolbar>
        </AppBar>
    )
}
