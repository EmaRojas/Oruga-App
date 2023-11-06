import { Container, Box, ButtonGroup, Button, Grid } from "@mui/material";
import { Table } from "../components/membership/table";
import { TableMembershipsByUser } from "../components/membershipByUser/table";


export const Membership = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>
                <Grid container spacing={2}>
                    <Grid item md={5} xs={12}>
                        <Box
                            component='main'
                            sx={{ p: 3 }}
                        >
                            <Table />
                        </Box>
                    </Grid>
                    <Grid item md={7} xs={12}>
                        <Box
                            component='main'
                            sx={{ p: 3 }}
                        >
                            <TableMembershipsByUser />
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}

