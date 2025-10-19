import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'

const GuestLayout = () => {

  const{token,user}=useStateContext()

  if(token){
          return <Navigate to="/home" />;
  }
  return (
    <div>
      <Outlet/>
    </div>
  )
}

export default GuestLayout
