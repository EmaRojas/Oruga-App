import { Navigate, Route, Routes } from "react-router-dom"
import { HomePage } from "../pages/HomePage"
import { ClientsPage } from "../pages/ClientsPage"

export const OrugaRoutes = () => {
  return (
   <Routes>
    <Route path="/" element={ <HomePage/> }/>
    <Route path="/clientes" element={ <ClientsPage/> }/>
    <Route path="/*" element={ <Navigate to="/" /> }/>
   </Routes>
  )
}
