import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { Table } from "../components/reservation/table";
import { Box, Toolbar, IconButton, Container } from "@mui/material"

import '../styles/home.css'


const Reservation = () => {


  const { user } = UserAuth();



  return (
    <div class="container">
            <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>

            <Box
                component='main'
                sx={{ flexGrow: 1, p: 3 }}
            >
                <Table />
            </Box>
            </Box>
    </div>


  )
};

export default Reservation;
