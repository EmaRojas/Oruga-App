import { Routes, Route, Navigate } from "react-router-dom"
import { AuthRoutes } from "../auth/routes/AuthRoutes"
import { useCheckAuth } from "../hooks/useCheckAuth";
import { CheckingAuth } from "../ui/components/CheckingAuth";
import { OrugaRoutes } from "../oruga/routes/OrugaRoutes";
import { ClientPage } from "../oruga/pages/ClientPage";

export const AppRouter = () => {

  const status = useCheckAuth();

  if ( status === 'checking' ) {
    return <CheckingAuth/>
  }

  return (
    <>
        <Routes>
              {
          (status === 'authenticated')
           ? <Route path="/*" element={ <OrugaRoutes /> } />
           : <Route path="/auth/*" element={ <AuthRoutes /> } />
        }
        <Route path='/*' element={ <Navigate to='/auth/login' />  } />
    </Routes>
    </>

  )
}
