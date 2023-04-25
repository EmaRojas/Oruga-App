import { Link as RouterLink } from 'react-router-dom';
import { Google } from "@mui/icons-material"
import { Alert, Button, Grid, Link, TextField, Typography } from "@mui/material"
import { useForm } from '../../hooks/useForm'
import { useDispatch, useSelector } from 'react-redux'
import { useMemo } from 'react'
import { startGoogleSignIn, startLoginWithEmailPassword } from '../../store/auth/thunks'

const formData = {
  email: '',
  password: ''
}

export const LoginPage = () => {

  const { status, errorMessage } = useSelector( state => state.auth );

  const dispatch = useDispatch();
  const { email, password, onInputChange } = useForm(formData);

  const isAuthenticating = useMemo( () => status === 'checking', [status]);

  const onSubmit = ( event ) => {
    event.preventDefault();

    // console.log({ email, password })
    dispatch( startLoginWithEmailPassword({ email, password }) );
  }

  const onGoogleSignIn = () => {
    console.log('onGoogleSignIn');
    dispatch( startGoogleSignIn() );
  }

  return (
    <Grid container
    spacing={0}
    direction="column"
    alignItems="center"
    justifyContent="center"
    sx={{minHeight:'100vh', backgroundColor:'primary.main', padding:4}}>


      <Grid item className="box-shadow" xs={3} 
      sx={{backgroundColor:'white', padding:3, borderRadius:2}}>

        <Typography variant='h5' align="center" sx={{mb:1}}>Login</Typography>

        <form onSubmit={ onSubmit } className='animate__animated animate__fadeIn animate__faster'>
          <Grid container>
            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                label="Correo" 
                type="email" 
                placeholder='correo@google.com' 
                fullWidth
                name="email"
                value={ email }
                onChange={ onInputChange }
              />
            </Grid>

            <Grid item xs={ 12 } sx={{ mt: 2 }}>
              <TextField 
                label="Contraseña" 
                type="password" 
                placeholder='Contraseña' 
                fullWidth
                name="password"
                value={ password }
                onChange={ onInputChange }
              />
            </Grid>


            <Grid 
              container
              display={ !!errorMessage ? '': 'none' }
              sx={{ mt: 1 }}>
              <Grid 
                  item 
                  xs={ 12 }
                >
                <Alert severity='error'>{ errorMessage }</Alert>
              </Grid>
            </Grid>
            
            <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={ 12 } sm={ 6 }>
                <Button
                  disabled={ isAuthenticating }
                  type="submit" 
                  variant='contained' 
                  fullWidth>
                    <Typography color='secondary.main' sx={{ ml: 1 }}>Ingresar</Typography>
                </Button>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <Button
                   disabled={ isAuthenticating }
                   variant='contained' 
                   fullWidth
                   onClick={ onGoogleSignIn }>
                  <Google sx={{color:'secondary.main'}} />
                  <Typography color='secondary.main' sx={{ ml: 1 }}>Google</Typography>
                </Button>
              </Grid>
            </Grid>


            <Grid container direction='row' justifyContent='end'>
              <Link component={ RouterLink } color='inherit' to="/auth/register">
                Crear una cuenta
              </Link>
            </Grid>

          </Grid>


        </form>
      </Grid>
    </Grid>
  )
}
