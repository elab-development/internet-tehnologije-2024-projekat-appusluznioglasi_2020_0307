import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import {Button, Card, Col, Container, Modal, Row, Spinner,Form} from "react-bootstrap";
import axiosClient from "../axios-client.js";
import ServiceListWithReviews from "./ServiceCard.jsx";
import ServiceCard from "./ServiceCard.jsx";
import AppointmentList from "./AppointmenList.jsx";


const Home = () => {
    const navigate = useNavigate();
    const { user, token } = useStateContext();

    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [loadingServices, setLoadingServices] = useState(false);
    const [showAllBookings, setShowAllBookings] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedService,setSelectedService]=useState(null);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

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
            if (!token||user?.role!=="user"){
                return
            }
            try {
                setLoadingServices(true)
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
        <>

        <Container className="mt-4">
            {(loadingBookings || loadingServices) && <Spinner animation="border" />}

            {/* Bookings */}
            {!loadingBookings && (
                <>
                    <h3 className="mb-3">Vaše rezervacije</h3>
                    {(bookings || []).length === 0 ? (
                        <p>Nema rezervacija.</p>
                    ) : (
                        <Row>
                            {(showAllBookings ? bookings : bookings.slice(0, 6)).map((booking) => {
                                const bookingDate = new Date(booking.schedule?.date);
                                const isPast = bookingDate < new Date(); // da li je termin prošao

                                return (
                                    <Col md={4} className="mb-4" key={booking.id}>
                                        <Card
                                            className="h-100 shadow-sm position-relative"
                                            style={{ borderRadius: '12px', padding: '1rem' }}
                                        >
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: '1rem',
                                                    right: '1rem',
                                                    fontSize: '0.9rem',
                                                    color: '#555',
                                                    fontWeight: '500',
                                                }}
                                            >
                                                {bookingDate.toLocaleDateString('sr-RS', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </div>

                                            <Card.Body className="d-flex flex-column justify-content-between h-100">
                                                <Card.Title
                                                    style={{
                                                        textAlign: 'center',
                                                        fontSize: '1.3rem',
                                                        marginTop: '1rem',
                                                    }}
                                                    className="fw-bold mb-4"
                                                >
                                                    {booking.schedule?.service?.title || 'Nepoznata usluga'}
                                                </Card.Title>

                                                <div
                                                    style={{
                                                        border: '1px solid #ddd',
                                                        borderRadius: '8px',
                                                        padding: '0.5rem',
                                                        fontSize: '0.85rem',
                                                        marginBottom: 'auto',
                                                    }}
                                                >
                                                    <h6 className="mb-2">
                                                        <b>Izvršilac:</b>{' '}
                                                        {booking.schedule?.service?.freelancer?.name ||
                                                            booking.schedule?.service?.company?.name ||
                                                            'Nepoznat'}
                                                    </h6>
                                                    <p className="mb-0">
                                                        <b>Status:</b>{' '}
                                                        <span
                                                            className={`fw-bold text-${
                                                                booking.status === 'confirmed' ? 'success' : 'warning'
                                                            }`}
                                                        >
                                        {booking.status}
                                    </span>
                                                    </p>
                                                </div>

                                                <div
                                                    className="mt-3 mb-5"
                                                    style={{ fontSize: '0.85rem', color: '#555' }}
                                                >
                                                    <b>Vreme:</b>{' '}
                                                    {(booking.schedule?.time_from).slice(0, 5)} -{' '}
                                                    {(booking.schedule?.time_to).slice(0, 5)}
                                                </div>

                                                {isPast && (
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="position-absolute"
                                                        style={{
                                                            bottom: '1rem',
                                                            right: '1rem',
                                                            borderRadius: '8px',
                                                        }}
                                                        onClick={() => {
                                                            setSelectedBooking(booking);
                                                            setShowReviewModal(true);
                                                        }}
                                                    >
                                                        Dodaj recenziju
                                                    </Button>
                                                )}
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}

                    {bookings.length > 6 && !showAllBookings && (
                        <Button onClick={() => setShowAllBookings(true)}>Vidi još</Button>
                    )}

                    <hr className="my-5" /> {/* Divider između bookings i services */}
                </>
            )}

            {(user?.role === 'user' ) && (!loadingServices) (

                <>
                    <h3 className="mb-3" >Najbolje ocenjene usluge</h3>
                    {/* Proverite da li services postoji i ima elemente */}
                    {services && services.length > 0 ? (
                        <Row>
                            {services.map((service) => (
                                <ServiceCard
                                    key={service.id}
                                    service={service}
                                />
                            ))}
                        </Row>
                    ) : (
                        <p>Nema sličnih usluga za prikaz.</p>
                    )}
                </>
            )}



        </Container>
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Dodaj recenziju za {selectedBooking?.schedule?.service?.title}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Ocena:</Form.Label>
                            <div className="d-flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span
                                        key={star}
                                        onClick={() => setRating(star)}
                                        style={{
                                            fontSize: "1.8rem",
                                            cursor: "pointer",
                                            color: star <= rating ? "#ffc107" : "#ccc",
                                        }}
                                    >
              ★
            </span>
                                ))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Komentar (opciono):</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                        Otkaži
                    </Button>
                    <Button
                        variant="primary"
                        onClick={async () => {
                            await axiosClient.post("/reviews", {
                                service_id: selectedBooking.schedule.service.id,
                                rating:rating,
                                comment:comment,
                                user_id:user.id
                            });
                            setShowReviewModal(false);
                            alert("Recenzija uspešno dodata!");
                        }}
                    >
                        Pošalji
                    </Button>
                </Modal.Footer>
            </Modal>
</>

            );
};

export default Home;

