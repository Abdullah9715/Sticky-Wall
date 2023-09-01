import React from 'react'
import { Routes,Route, BrowserRouter , Navigate} from 'react-router-dom'
import Frontend from '../index'
import Auth from "../../Auth/index"
import { useAuthContext } from '../../contexts/AuthContext'
import Regitser from '../../Auth/Register'
export default function Router() {
  const { isAuth } = useAuthContext()
  return (
    <BrowserRouter>
    <Routes>
       {/* If authenticated, show the frontend page, else redirect to login */}
       <Route path="/*" element={isAuth ? <Frontend /> : <Navigate to="/auth/login" />} />
        
        {/* If not authenticated, show the login page, else redirect to frontend */}
        <Route path="/auth/*" element={!isAuth ? <Auth /> : <Navigate to="/" />} />
        <Route path='/register' element={<Regitser/>}/>

        {/* <Route path='/*' element={<Frontend/>}/>
        <Route path='/*' element={<Frontend/>}/> */}
        </Routes>
    </BrowserRouter>

  )
}
