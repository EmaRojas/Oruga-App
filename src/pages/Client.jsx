import { Container, Box, ButtonGroup, Button, } from "@mui/material";
import { Table } from "../components/client/table";


export const Client = () => {
    return (
        <Container maxWidth="xl">
            <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>

                <Box
                    component='main'
                    sx={{ flexGrow: 1, p: 3 }}
                >
                    <Table />
                </Box>
            </Box>
        </Container>
    )
}

