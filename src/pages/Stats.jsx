import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { Overview } from "../components/stats/overview";

import { Box, Toolbar, IconButton, Container } from "@mui/material"

import '../styles/home.css'


const Stats = () => {


  const { user } = UserAuth();



  return (
    <div class="container">
            <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>

            <Box
                component='main'
                sx={{ flexGrow: 1, p: 3 }}
            >
                <Overview />
            </Box>
            </Box>
    </div>


  )
};

export default Stats;
