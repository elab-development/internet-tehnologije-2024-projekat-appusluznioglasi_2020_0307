import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'

const DefaultLayout = () => {

  const {user,token}=useStateContext()
  if(!token){
    return <Navigate to="/login"/>;
  }
  const onLogout=(ev)=>{
    ev.preventDefault()
  }
  return (

    <div id="defaultLayout">
     
      <div className="content">
        <header>
          <div>
            Header
          </div>

          <div>
            {user.name}
            <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
          </div>
        </header>
        <main>
         <Outlet/>
        </main>
        
      </div>
    </div>
  )
}

export default DefaultLayout
