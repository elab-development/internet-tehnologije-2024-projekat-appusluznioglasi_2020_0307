import React, {useEffect, useState} from 'react'
import {Navigate, Outlet, useNavigate} from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import {Button, Container, Form, FormControl, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {FaChevronDown} from "react-icons/fa";
import axiosClient from "../axios-client.js";

const DefaultLayout = () => {
    const { user, token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();
    const [searchQuery,setSearchQuery]=useState("");




    if (!token||!user){
        <Navigate to={"/login"}/>
    }


    useEffect(() => {

        if (!user) {
            axiosClient.get(`/user/me`)
                .then(({ data }) => {
                    setUser(data.user);
                    console.log('ruta',data.user)
                }

                )
                .catch(err => console.error(err));
        }
    },[user] );

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        navigate('/login');
    };


    const getDisplayName = () => {
        if (!user) return '';
        if (user.role === 'company') return user.company?.name || 'Kompanija';
        return user.name || 'Korisnik';
    };

    const getInitial = () => {
        const displayName = getDisplayName();
        return displayName?.charAt(0).toUpperCase() || '?';
    };

    const handleSearch=(e)=>{
        e.preventDefault()
        if (searchQuery.trim()!==""){
            navigate(`/services?query=${encodeURIComponent(searchQuery)}`);
        }
    }

    return (
        <>
            <Navbar
                bg="light"
                expand="lg"
                sticky="top"

                className="mb-3 shadow-sm"
                style={{
                    borderBottom: '1px solid #ddd',
                    fontSize: '1.1rem',
                    padding: '0.6rem 0',
                }}
            >
                <Container className="d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <Navbar.Brand
                            onClick={() => navigate('/home')}
                            style={{ fontWeight: '600', cursor:'pointer', fontSize: '2rem' }}
                        >
                            ServisHub
                        </Navbar.Brand>

                        {(user?.role === 'company' || user?.role === 'freelancer') && (
                         <Nav.Link
                            onClick={() => navigate('/my-services')}
                            style={{ cursor: 'pointer', color: '#555', fontWeight: '500' }}
    >
                             My services
                        </Nav.Link>
                        )}


                        {user?.role !== 'user' && (
                        <Nav.Link
                            onClick={() => navigate('/services')}
                            style={{ cursor: 'pointer', color: '#555', fontWeight: '500' }}
                        >
                            Usluge
                        </Nav.Link>
                        )}

                        {user?.role !== 'user' && (
                            <Nav.Link
                                onClick={() => navigate('/my-schedules')}
                                style={{ cursor: 'pointer', color: '#555', fontWeight: '500' }}
                            >
                                My schedules
                            </Nav.Link>
                        )}

                        {user?.role === 'user' && (
                            <Form className="d-flex align-items-center" onSubmit={handleSearch} style={{ gap: '0.5rem', marginTop:'1rem' }}>
                                <FormControl
                                    type="search"
                                    placeholder="Pretraži usluge..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        borderRadius: '50px',
                                        padding: '0.6rem 1.2rem',
                                        border: '1px solid #ccc',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                        width: '250px',
                                        transition: 'all 0.2s',
                                    }}
                                    onFocus={(e) => e.target.style.boxShadow = '0 2px 10px rgba(0,123,255,0.3)'}
                                    onBlur={(e) => e.target.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)'}
                                />
                                <Button
                                    type="submit"
                                    style={{
                                        borderRadius: '50px',           // ovalno dugme
                                        backgroundColor: '#0d6efd',     // moderni plavi ton
                                        border: 'none',
                                        padding: '0.55rem 1rem',
                                        color: '#fff',
                                        fontWeight: '500',
                                        marginBottom:'1rem',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={(e) => e.target.style.backgroundColor = '#0b5ed7'}
                                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0d6efd'}
                                >
                                    Pretraži
                                </Button>
                            </Form>

                        )}


                        
                    </div>

                    <div className="d-flex align-items-center">
                        <Nav>
                            <NavDropdown
                                align="end"
                                title={
                                    <div className="d-flex align-items-center gap-2">
                                        <div
                                            style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '50%',
                                                backgroundColor: '#0d6efd',
                                                color: 'white',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontWeight: '600',
                                                fontSize: '1rem',
                                                textTransform: 'uppercase',
                                            }}
                                        >
                                            {getInitial()}
                                        </div>

                                        <span style={{ fontWeight: '500', color: '#333' }}>
                                            {getDisplayName()}
                                         </span>
                                       <FaChevronDown
                                       style={{
                                           fontSize:'1.2rem',
                                           color:'#333',
                                           marginLeft:'4px'
                                       }}
                                       />

                                    </div>
                                }
                                id="profile-dropdown"
                            >
                                {user?.role !== 'user' && (
                                <NavDropdown.Item onClick={() => {
                                    console.log("USER:", user);

                                    if (user.role === 'company') {
                                        navigate(`/profile/${user.company.id}`)
                                    } else {
                                        navigate(`/profile/${user.id}`)
                                    }
                                }
                                  }>

                                    Profil
                                </NavDropdown.Item>
                                    )}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>Odjavi se</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </div>
                </Container>
            </Navbar>

            <Container>
                <Outlet />
            </Container>
        </>
    );
}

export default DefaultLayout
