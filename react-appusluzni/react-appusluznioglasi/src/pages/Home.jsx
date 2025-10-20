import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider.jsx";
import {
    Button,
    Card,
    Col,
    Container,
    Modal,
    Row,
    Spinner,
    Form,
} from "react-bootstrap";
import axiosClient from "../axios-client.js";
import ServiceCard from "../elements/ServiceCard.jsx";
import BookingCard from "../elements/BookingCart.jsx";
import {BsArrowLeft, BsArrowRight} from "react-icons/bs";

const Home = () => {
    const navigate = useNavigate();
    const { user, token } = useStateContext();

    const [bookings, setBookings] = useState([]);
    const [services, setServices] = useState([]);
    const [loadingBookings, setLoadingBookings] = useState(true);
    const [loadingServices, setLoadingServices] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);
    const [showAllBookings, setShowAllBookings] = useState(false);

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    // 📅 Fetch bookings
    const fetchBookings = async (page = 1) => {
        if (!token) return;
        try {
            setLoadingBookings(true);
            const res = await axiosClient.get(`/bookings/showForUserId?page=${page}`);
            const newBookings = res.data?.bookings || [];
            setBookings(newBookings);
            setCurrentPage(res.data.current_page);
            setLastPage(res.data.last_page);
            console.log("📘 Bookings (page " + page + "):", newBookings);
        } catch (e) {
            console.error("❌ Greška pri učitavanju bookings:", e);
        } finally {
            setLoadingBookings(false);
        }
    };

    // 💎 Fetch services (Top rated)
    const fetchServices = async () => {
        if (!token || user?.role !== "user") return;
        try {
            setLoadingServices(true);
            const res = await axiosClient.get("/services/topRated");
            if (res.data && res.data.services) {
                setServices(res.data.services);
                console.log("💎 Services loaded:", res.data.services);
            }
        } catch (e) {
            console.error("❌ Greška pri učitavanju services:", e);
        } finally {
            setLoadingServices(false);
        }
    };

    // ⏳ useEffects
    useEffect(() => {
        if (token) {
            fetchBookings();
            fetchServices();
        }
    }, [token, user]);

    return (
        <>
            <Container className="mt-4">
                {(loadingBookings || loadingServices) && (
                    <div className="text-center my-5">
                        <Spinner animation="border" variant="primary" />
                    </div>
                )}

                {/* BOOKINGS */}
                {!loadingBookings && (
                    <>
                        <div className="d-flex align-items-center justify-content-between mb-3">
                            <h3 className="fw-bold text-primary mb-0 d-flex align-items-center gap-2">
                                📅 <span>Vaše rezervacije</span>
                            </h3>
                            {bookings.length > 0 && (
                                <Button
                                    variant="outline-primary"
                                    size="sm"
                                    onClick={() => setShowAllBookings(!showAllBookings)}
                                    style={{
                                        borderRadius: "20px",
                                        fontWeight: "500",
                                    }}
                                >
                                    {showAllBookings ? "Prikaži manje" : "Vidi još"}
                                </Button>
                            )}
                        </div>

                        {bookings.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <p className="fs-5">📭 Trenutno nemate rezervacija.</p>
                            </div>
                        ) : (
                            <Row>
                                {(showAllBookings ? bookings : bookings.slice(0, 6)).map(
                                    (booking) => (
                                        <Col md={6} lg={4} className="mb-4" key={booking.id}>
                                            <BookingCard
                                                booking={booking}
                                                onAddReview={(b) => {
                                                    setSelectedBooking(b);
                                                    setShowReviewModal(true);
                                                }}
                                            />
                                        </Col>
                                    )
                                )}
                            </Row>
                        )}

                        {/* Pagination Controls */}
                        {bookings.length > 0 && (
                            <div
                                className="d-flex justify-content-center align-items-center gap-4 mt-4"
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                <Button
                                    variant="outline-primary"
                                    disabled={currentPage === 1}
                                    onClick={() => fetchBookings(currentPage - 1)}
                                    className="d-flex justify-content-center align-items-center"
                                    style={{
                                        borderRadius: "50%",
                                        width: "50px",
                                        height: "50px",
                                        fontSize: "2rem",
                                    }}
                                >
                                    <BsArrowLeft></BsArrowLeft>
                                </Button>

                                <span className="fw-semibold text-muted">
                                    Strana {currentPage} / {lastPage}
                                </span>

                                <Button
                                    variant="outline-primary"
                                    disabled={currentPage === lastPage}
                                    onClick={() => fetchBookings(currentPage + 1)}
                                    className="d-flex justify-content-center align-items-center"
                                    style={{
                                        borderRadius: "50%",
                                        width: "50px",
                                        height: "50px",
                                        fontSize: "1.4rem",
                                    }}
                                >
                                    <BsArrowRight />

                                </Button>
                            </div>
                        )}

                        <hr className="my-5" />
                    </>
                )}

                {/* SERVICES */}
                {user?.role === "user" && !loadingServices && (
                    <>
                        <h3 className="mb-3 fw-bold text-primary">
                            💎 Najbolje ocenjene usluge
                        </h3>
                        {services && services.length > 0 ? (
                            <Row>
                                {services.map((service) => (
                                    <ServiceCard key={service.id} service={service} />
                                ))}
                            </Row>
                        ) : (
                            <p>Nema sličnih usluga za prikaz.</p>
                        )}
                    </>
                )}
            </Container>

            {/* REVIEW MODAL */}
            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        Dodaj recenziju za{" "}
                        {selectedBooking?.schedule?.service?.title || "uslugu"}
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
                                rating,
                                comment,
                                user_id: user.id,
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

