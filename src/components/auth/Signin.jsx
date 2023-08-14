import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Grid, Link as RouterLink, TextField, Typography } from "@mui/material"
import { UserAuth } from '../../context/AuthContext';
import { useForm } from '../../hooks/useForm';
import { Google } from "@mui/icons-material"

const formData = {
  email: '',
  password: ''
} 
const Signin = () => {
 
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { signIn, signInWithGoogle, user } = UserAuth();

  useEffect(() => {

    if(user) {
      navigate('/home')
    }   
 },[]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await signIn(email, password)
      navigate('/home')
    } catch (e) {
      setError(e.message)
      console.log(e.message)
    }
  };

  const handleSubmitGoogle = async (e) => {
    e.preventDefault();
    setError('')
    try {
      await signInWithGoogle()
      navigate('/home')
    } catch (e) {
      setError(e.message)
      console.log(e.message)
    }
  };

  const { email, password, onInputChange } = useForm(formData);

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

        <form onSubmit={ handleSubmit } className='animate__animated animate__fadeIn animate__faster'>
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
              display={ !!error ? '': 'none' }
              sx={{ mt: 1 }}>
              <Grid 
                  item 
                  xs={ 12 }
                >
                <Alert severity='error'>{ error }</Alert>
              </Grid>
            </Grid>
            
            <Grid container spacing={ 2 } sx={{ mb: 2, mt: 1 }}>
              <Grid item xs={ 12 } sm={ 6 }>
                <Button
                  //disabled={ isAuthenticating }
                  type="submit" 
                  variant='contained' 
                  fullWidth>
                    <Typography color='secondary.main' sx={{ ml: 1 }}>Ingresar</Typography>
                </Button>
              </Grid>
              <Grid item xs={ 12 } sm={ 6 }>
                <Button
                   //disabled={ isAuthenticating }
                   variant='contained' 
                   fullWidth
                   onClick={ handleSubmitGoogle }>
                  <Google sx={{color:'secondary.main'}} />
                  <Typography color='secondary.main' sx={{ ml: 1 }}>Google</Typography>
                </Button>
              </Grid>
            </Grid>


            <Grid container direction='row' justifyContent='end'>
              <Link component={ RouterLink } color='inherit' to="/signup">
                Crear una cuenta
              </Link>
            </Grid>

          </Grid>


        </form>
      </Grid>
    </Grid>
  )
};

export default Signin;
