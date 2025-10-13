import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import axiosClient from "../axios-client.js";

const Home = () => {
    const navigate = useNavigate();
    const { user, token } = useStateContext();

    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [loadingServices, setLoadingServices] = useState(true);
    const [showAllBookings, setShowAllBookings] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    // Fetch bookings
    const fetchBookings = async (page = 1) => {
        if (!token) return;
        try {
            const res = await axiosClient.get(`/bookings/showForUserId?page=${page}`, );

            const newBookings = res.data?.bookings || [];

            setBookings(prev => page === 1 ? newBookings : [...prev, ...res.data.bookings]);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);
            console.log("bookings", res.data.bookings);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingBookings(false);
        }
    };

    useEffect(() => {
        if (token) fetchBookings();
    }, [user, token]);

    const loadMoreBookings = async () => {
        if (currentPage < lastPage) {
            const res = await axiosClient.get(`/bookings/showForUserId?page=${currentPage + 1}`);
            const newBookings = res.data?.bookings || [];

            setBookings(prev => [...prev,...newBookings]);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);
        }
    };

    useEffect(() => {
        const fetchServices = async () => {
            if (!token) return;
            try {
                console.log("TOken in bookings",token);
                const res = await axiosClient.get("/services/topRated");
                setServices(res.data.services || []);
                console.log("services", res.data.services);
            } catch (e) {
                console.error(e);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, [token]);

    return (
        <Container className="mt-4">
            {(loadingBookings || loadingServices) && <Spinner animation="border" />}

            {/* Bookings */}
            {!loadingBookings && (
                <>
                    <h3 className="mb-3">Vaše rezervacije</h3>
                    {(bookings||[]).length === 0? (
                        <p>Nema rezervacija.</p>
                    ) : (
                        <Row>
                            {(showAllBookings ? bookings : bookings.slice(0, 6)).map((booking) => (
                                <Col md={4} className="mb-3" key={booking.id}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{booking.schedule?.service?.title || "Nepoznata usluga"}</Card.Title>
                                            <Card.Text>
                                                Termin: {new Date(booking.schedule?.date).toLocaleString()} <br />
                                                Izvršilac: {booking.schedule?.service?.freelancer?.name || booking.schedule?.service?.company?.name || "Nepoznat"} <br />
                                                Status: {booking.status}
                                            </Card.Text>
                                            <Button variant="primary" onClick={() => navigate(`/booking/${booking.id}`)}>
                                                Pogledaj detalje
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                    {bookings.length > 6 && !showAllBookings && (
                        <Button onClick={() => setShowAllBookings(true)}>Vidi još</Button>
                    )}

                    <hr className="my-5" /> {/* Divider između bookings i services */}
                </>
            )}

            {/* Services */}
            {!loadingServices && (
                <>
                    <h3 className="mb-3">Pogledajte još usluga</h3>
                    {services.length === 0 ? (
                        <p>Nema usluga.</p>
                    ) : (
                        <Row>
                            {services.map((service) => (
                                <Col md={4} className="mb-3" key={service.id}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title>{service.title}</Card.Title>
                                            <Card.Text>Ocena: {service.reviews_avg_rating || "Nema ocena"}</Card.Text>
                                            <Button variant="success" onClick={() => navigate(`/services/${service.id}`)}>
                                                Pogledaj
                                            </Button>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    )}
                </>
            )}
        </Container>
    );
};

export default Home;

