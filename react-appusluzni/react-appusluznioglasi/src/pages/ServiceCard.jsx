import React, { useState } from "react";
import { Card, Button, Modal, Spinner, Col } from "react-bootstrap"; // Dodat je Col import
import { FaStar } from "react-icons/fa";
import axiosClient from "../axios-client";
import AppointmentList from "./AppointmenList.jsx";



const ServiceCard = ({ service }) => {
    const [showReviewsModal, setShowReviewsModal] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const [showModal,setShowModal]=useState(false);
    const [selectedService,setSelectedService]=useState(null);

    const handleShowAppointments=(service)=>{
        setSelectedService(service);
        setShowModal(true);
    }

    const FALLBACK_IMAGE_URL = "https://placehold.co/400x250?text=Slika+nedostupna"; // Promenjen domen!
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";


    const getImageUrl = (imagePath) => {
        if (!imagePath) return FALLBACK_IMAGE_URL;
        return `${API_BASE_URL}/storage/${imagePath}`;
    };
    const handleShowReviews = async () => {
        setShowReviewsModal(true);
        try {
            setLoadingReviews(true);
            const res = await axiosClient.get(`/reviews/service/${service.id}`);
            setReviews(res.data.reviews || []);
        } catch (err) {
            console.error("Greška pri učitavanju komentara:", err);
        } finally {
            setLoadingReviews(false);
        }
    };

    const handleCloseReviews = () => {
        setReviews([]);
        setShowReviewsModal(false);
    };

    return (
        <Col md={4} className="mb-4"> {}
            <Card className="shadow-sm border-0 rounded-4 p-3 h-100 d-flex flex-column">

                {/* SLIKA */}
                <Card.Img
                    variant="top"
                    src={getImageUrl(service.image)}
                    alt={service.title}
                    className="rounded-3 mb-3"
                    style={{ height: '200px', objectFit: 'cover' }}
                />

                <Card.Body className="p-0 d-flex flex-column">
                    {/* Naslov */}
                    <h5
                        className="text-center fw-semibold mb-3"
                        style={{ fontSize: "1.1rem" }}
                    >
                        {service.title}
                    </h5>

                    {/* Izvršilac i Cena */}
                    <p className="text-muted text-center mb-2" style={{ fontSize: "0.95rem" }}>
                        {service.company ? service.company.name : service.freelancer?.name || "Nepoznat izvršilac"}
                    </p>
                    <p className="text-center fw-bold text-primary mb-3" style={{ fontSize: "1.2rem" }}>
                        {Number(service.price).toFixed(2)} €
                    </p>


                    {/* Donji deo - ZVEZDICA I DUGMAD */}
                    <div className="d-flex flex-column gap-2 mt-auto pt-3 border-top">

                        {/* Zvezdica/Ocena */}
                        <div className="d-flex justify-content-center align-items-center gap-1 mb-2">
                            <FaStar color="#ffc107" />
                            <span className="fw-semibold">
                                {service.reviews_avg_rating
                                    ? Number(service.reviews_avg_rating).toFixed(1)
                                    : "N/A"}
                            </span>
                        </div>

                        {/* Dugme za Rezervaciju (celom dužinom) */}
                        <Button
                            variant="primary"
                            onClick={() => handleShowAppointments(service)}
                            className="w-100 rounded-pill px-3"
                        >
                            Rezerviši Termin
                        </Button>

                        {/* Dugme za Komentare (celom dužinom) */}
                        <Button
                            variant="outline-secondary"
                            onClick={handleShowReviews}
                            className="w-100 rounded-pill px-3"
                        >
                            Vidi Komentare
                        </Button>
                    </div>
                </Card.Body>
            </Card>

            <Modal show={showReviewsModal} onHide={handleCloseReviews} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Komentari za {service?.title}</Modal.Title>
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
            <Modal show={showModal} onHide={()=>setShowModal(false)} size="lg" centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Dostupni termini za :{service?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedService?(
                        <AppointmentList serviceId={service?.id}></AppointmentList>
                    ):(
                        <p>Ucitavanje...</p>
                    )}
                </Modal.Body>
            </Modal>
        </Col>
    );
};

export default ServiceCard;
