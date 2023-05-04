import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { Alert, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from '../../hooks/useForm';

const formData = {
  email: '',
  password: '',
  displayName: ''
}

const Signup = () => {
  const [error, setError] = useState('')
  const { createUser } = UserAuth();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const navigate = useNavigate()

  const formValidations = {
    email: [(value) => value.includes('@'), 'El correo debe de tener una @'],
    password: [(value) => value.length >= 6, 'El password debe de tener más de 6 letras.'],
    displayName: [(value) => value.length >= 1, 'El nombre es obligatorio.'],
  }

  const {
    formState, displayName, email, password, onInputChange,
    isFormValid, displayNameValid, emailValid, passwordValid,
  } = useForm(formData, formValidations);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setFormSubmitted(true);
      if (!isFormValid) return;
      await createUser(email, password);
      navigate('/account')
    } catch (e) {
      setError(e.message);
      console.log(e.message);
        }
  }

  return (
    <Grid container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      sx={{ minHeight: '100vh', backgroundColor: 'primary.main', padding: 4 }}>


      <Grid item className="box-shadow" xs={3}
        sx={{ backgroundColor: 'white', padding: 3, borderRadius: 2 }}>

        <Typography variant='h5' align="center" sx={{ mb: 1 }}>Registrate</Typography>

        <form onSubmit={handleSubmit} className='animate__animated animate__fadeIn animate__faster'>
          <Grid container>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Nombre completo"
                type="text"
                placeholder='Nombre completo'
                fullWidth
                name="displayName"
                value={displayName}
                onChange={onInputChange}
                error={!!displayNameValid && formSubmitted}
                helperText={displayNameValid}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Correo"
                type="email"
                placeholder='correo@google.com'
                fullWidth
                name="email"
                value={email}
                onChange={onInputChange}
                error={!!emailValid && formSubmitted}
                helperText={emailValid}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <TextField
                label="Contraseña"
                type="password"
                placeholder='Contraseña'
                fullWidth
                name="password"
                value={password}
                onChange={onInputChange}
                error={!!passwordValid && formSubmitted}
                helperText={passwordValid}
              />
            </Grid>

            <Grid container spacing={2} sx={{ mb: 2, mt: 1 }}>

              <Grid
                item
                xs={12}
                display={error.length > 0 ? '' : 'none'}
              >
                <Alert severity='error'>{error}</Alert>
              </Grid>

              <Grid item xs={12}>
                <Button
                  //disabled={isCheckingAuthentication}
                  type="submit"
                  variant='contained'
                  fullWidth>
                  <Typography color='secondary.main'>Crear Cuenta</Typography>
                </Button>
              </Grid>
            </Grid>


            <Grid container direction='row' justifyContent='end'>
              <Typography sx={{ mr: 1 }}>¿Ya tienes cuenta?</Typography>
              <Link component={RouterLink} color='primary.main' to="/">
                ingresar
              </Link>
            </Grid>

          </Grid>


        </form>
      </Grid>
    </Grid>

  )
  // return (
  //   <div className='max-w-[700px] mx-auto my-16 p-4'>
  //     <div>
  //       <h1 className='text-2xl font-bold py-2'>Registrate</h1>
  //       <p className='py-2'>
  //         Ya tenés una cuenta?{' '}
  //         <Link to='/' className='underline'>
  //           Iniciar sesión.
  //         </Link>
  //       </p>
  //     </div>
  //     <form onSubmit={handleSubmit}>
  //       <div className='flex flex-col py-2'>
  //         <label className='py-2 font-medium'>Email</label>
  //         <input
  //           onChange={(e) => setEmail(e.target.value)}
  //           className='border p-3'
  //           type='email'
  //         />
  //       </div>
  //       <div className='flex flex-col py-2'>
  //         <label className='py-2 font-medium'>Contraseña</label>
  //         <input
  //           onChange={(e) => setPassword(e.target.value)}
  //           className='border p-3'
  //           type='password'
  //         />
  //       </div>
  //       <button className='border border-blue-500 bg-blue-600 hover:bg-blue-500 w-full p-4 my-2 text-white'>
  //         Registrarme
  //       </button>
  //     </form>
  //   </div>
  // );
};

export default Signup;
