import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router-dom'
import DefaultLayout from './layouts/DefaultLayout.jsx'
import GuestLayout from './layouts/GuestLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import NotFound from './pages/NotFound.jsx'
import Home from './pages/Home.jsx'
import { ContextProvider } from './contexts/ContextProvider.jsx'
import HomeCompanyFreelancer from "./pages/HomeCompanyFreelancer.jsx";
import Profile from "./pages/Profile.jsx";
import Services from "./pages/Services.jsx";


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ContextProvider>
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<GuestLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route path="/" element={<DefaultLayout />}>
            <Route path="/home" element={<Home/>}/>
            <Route path="/services" element={<Services/>}/>
            <Route path="/homeCompanyFrelanceer" element={<HomeCompanyFreelancer/>}/>
            <Route path="/profile/:id" element={<Profile/>}/>


        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
    </ContextProvider>
  </StrictMode>,
)
