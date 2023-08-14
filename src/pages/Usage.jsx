import React from 'react';
import { UserAuth } from '../context/AuthContext';
import { Box, Toolbar, IconButton, Container } from "@mui/material"
import Grid from '@mui/material/Grid';
import { Table } from "../components/usage/table";
import { ActiveUsers } from "../components/home/activeUsers";

import '../styles/home.css'
const Home = () => {


  const { user } = UserAuth();


  return (
    <Container maxWidth="xl">
    <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>
        <Grid container spacing={2}>
            <Grid item md={12} xs={12}>
                <Box
                    component='main'
                    sx={{ p: 3 }}
                >
                    <Table />
                </Box>
            </Grid>

        </Grid>
    </Box>
</Container>

  )
};

export default Home;
