import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'

const GuestLayout = () => {

  const{token,user}=useStateContext()

  if(token){
      if (user?.role === 'freelancer'||user?.role==='company') {
          return <Navigate to="/homeCompanyFrelanceer" />;
      } else {
          return <Navigate to="/home" />;
      }
  }
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default GuestLayout
