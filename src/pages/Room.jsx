import { Container, Box, ButtonGroup, Button, Grid } from "@mui/material";
import { Table } from "../components/room/table";
import { TablePriceRoom } from "../components/priceRoom/table";


export const Room = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>
                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <Box
                            component='main'
                            sx={{ p: 3 }}
                        >
                            <Table />
                        </Box>
                    </Grid>
                    <Grid item md={6} xs={12}>
                        <Box
                            component='main'
                            sx={{ p: 3 }}
                        >
                            <TablePriceRoom />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

