import React, { useState } from "react";
import { Row, Col, Card, Button, Modal, Spinner } from "react-bootstrap";
import { FaStar } from "react-icons/fa";
import axiosClient from "../axios-client.js";

const ServiceList = ({ services }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    const handleShow = async (service) => {
        setSelectedService(service);
        setShowModal(true);
        await fetchReviews(service.id);
    };

    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


    const FALLBACK_IMAGE_URL = "https://placehold.co/400x250?text=Slika+nedostupna";

    const getImageUrl = (imagePath) => {
        if (!imagePath) return FALLBACK_IMAGE_URL;
        return `${API_BASE_URL}/storage/${imagePath}`;
    };

    const handleClose = () => {
        setSelectedService(null);
        setReviews([]);
        setShowModal(false);
    };

    const fetchReviews = async (serviceId) => {
        try {
            setLoadingReviews(true);
            const res = await axiosClient.get(`/reviews/service/${serviceId}`);
            setReviews(res.data.reviews || []);
        } catch (err) {
            console.error("Greška pri učitavanju komentara:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    return (
        <>
            {services.length === 0 ? (
                <p>Nema usluga.</p>
            ) : (
                <Row>
                    {services.map((service) => (
                        <Col md={4} className="mb-4" key={service.id}>
                            <Card className="shadow-sm border-0 rounded-4 p-3 h-100 d-flex flex-column justify-content-between">

                                {/* Naslov */}
                                <h5
                                    className="text-center fw-semibold mb-4"
                                    style={{ fontSize: "1.1rem" }}
                                >
                                    {service.title}
                                </h5>

                                {/* Izvršilac */}
                                <p
                                    className="text-muted mb-4"
                                    style={{ fontSize: "0.95rem" }}
                                >
                                    {service.company
                                        ? service.company.name
                                        : service.freelancer?.name || "Nepoznat izvršilac"}
                                </p>
                                <Card.Img
                                    variant="top"
                                    src={getImageUrl(service.image)}
                                    alt={service.title}
                                    className="rounded-3 mb-3"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />

                                <div className="d-flex justify-content-between align-items-center mt-auto">
                                    <div className="d-flex align-items-center gap-1">
                                        <FaStar color="#ffc107" />
                                        <span className="fw-semibold">
                                            {service.reviews_avg_rating
                                                ? Number(service.reviews_avg_rating).toFixed(1)
                                                : "N/A"}
                                        </span>
                                    </div>

                                    <Button
                                        variant="outline-primary"
                                        size="sm"
                                        onClick={() => handleShow(service)}
                                        className="rounded-pill px-3"
                                    >
                                        Vidi komentare
                                    </Button>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal za komentare */}
            <Modal show={showModal} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Komentari za {selectedService?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {loadingReviews ? (
                        <div className="d-flex justify-content-center py-4">
                            <Spinner animation="border" />
                        </div>
                    ) : reviews.length > 0 ? (
                        reviews.map((r, idx) => (
                            <div
                                key={idx}
                                className="border-bottom py-2 d-flex justify-content-between"
                            >
                                <span>{r.comment}</span>
                                <span>
                                    <FaStar color="#ffc107" /> {r.rating}
                                </span>
                            </div>
                        ))
                    ) : (
                        <p>Nema komentara za ovu uslugu.</p>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
};

export default ServiceList;
