import React from 'react'
import {Navigate, Outlet, useNavigate} from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import {Button, Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {FaChevronDown} from "react-icons/fa";

const DefaultLayout = () => {
    const { user, token, setUser, setToken } = useStateContext();
    const navigate = useNavigate();

  if(!token){
    return <Navigate to="/login"/>;
  }

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        navigate('/');
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
                            onClick={() => navigate(getDashboardLink())}
                            style={{ fontWeight: '600', cursor:'pointer', fontSize: '2rem' }}
                        >
                            ServisHub
                        </Navbar.Brand>


                        <Nav.Link
                            onClick={() => navigate('/services')}
                            style={{ cursor: 'pointer', color: '#555', fontWeight: '500' }}
                        >
                            Usluge
                        </Nav.Link>
                        {user?.role !== 'user' && (
                            <Nav.Link
                                onClick={() => navigate('/termins')}
                                style={{ cursor: 'pointer', color: '#555', fontWeight: '500' }}
                            >
                                Termini
                            </Nav.Link>
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
