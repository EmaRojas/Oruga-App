import { Box, Toolbar, IconButton } from "@mui/material"
import { NavBar } from "../components/NavBar";

export const HomePage = () => {

  return (
    <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>

    <NavBar/>

    <Box 
        component='main'
        sx={{ flexGrow: 1, p: 3 }}
    >
        <Toolbar />
        
    </Box>
</Box>
  )
}
