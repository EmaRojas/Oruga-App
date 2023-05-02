import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { Box, Toolbar } from "@mui/material"
import { NavBar } from "../components/NavBar"
import { ClientPage } from "../pages/ClientPage"

export const OrugaRoutes = () => {
  return (
    <>
      <Box sx={{ display: 'flex' }} className='animate__animated animate__fadeIn animate__faster'>

        <NavBar />

        <Box
          component='main'
          sx={{ flexGrow: 1, p: 3 }}
        >
          <Toolbar />

        </Box>
      </Box>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/*" element={<Navigate to="/" />} />
      </Routes>
    </>

  )
}
