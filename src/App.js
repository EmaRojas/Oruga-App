import React from 'react';
import Signin from './components/auth/Signin';
import Signup from './components/auth/Signup';
import Account from './components/auth/Account';
import { AuthContextProvider, UserAuth } from './context/AuthContext';
import Home from './pages/Home';
import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ResponsiveAppBar from './components/ResponsiveAppBar';
import { AppTheme } from './theme/AppTheme';
import './style.css'
import { CssBaseline } from '@mui/material';
import { Client } from './pages/Client';
import { Membership } from './pages/Membership';

//https://fkhadra.github.io/react-toastify/introduction
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Reservation from './pages/Reservation';
import { Payment } from './pages/Payment';
import Availability from './pages/Availability';

function App() {
  return (
    <AppTheme>
        <ToastContainer autoClose={2000} position="top-center"/>
      <AuthContextProvider>
        <CssBaseline />
        <Routes>
          <Route path='/' element={<Signin />} />

          <Route path='/signup' element={<Signup />} />
          <Route
            path='/account'
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path='/home'
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path='/client'
            element={
              <ProtectedRoute>
                <Client />
              </ProtectedRoute>
            }
          />
          <Route
            path='/membership'
            element={
              <ProtectedRoute>
                <Membership />
              </ProtectedRoute>
            }
          />
          <Route
            path='/reservation'
            element={
              <ProtectedRoute>
                <Reservation />
              </ProtectedRoute>
            }
          />
          <Route
            path='/payment'
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
          <Route
            path='/availability'
            element={
              <ProtectedRoute>
                <Availability />
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContextProvider>
    </AppTheme>
  );
}

export default App;
