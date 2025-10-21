import { Card, Button } from "react-bootstrap";
import {useState} from "react";
import axios from "axios";
import axiosClient from "../axios-client.js";

const BookingCard = ({ booking, onAddReview,onBookingDeleted }) => {
    const bookingDate = new Date(booking.schedule?.date);
    const isPast = bookingDate < new Date();

    const [deleting, setDeleting] = useState(false);

    const handleDelete=()=>{
        if (!window.confirm("Da li sigurno želiš da otkažeš ovu rezervaciju?")) return;

        setDeleting(true)

        axiosClient.delete(`/bookings/delete/${booking.id}`)
            .then(()=>{
                alert("✅ Rezervacija uspešno otkazana.");
                if (onBookingDeleted) {
                    onBookingDeleted(booking.id);
                }
            }).catch((err)=>{
                console.log(err)
        }) .finally(() => setDeleting(false));

    }

    return (
        <Card
            className="shadow-sm border-0 h-100 position-relative hover-shadow transition-all"
            style={{
                borderRadius: "16px",
                overflow: "hidden",
                background: "linear-gradient(180deg, #f9f9ff 0%, #ffffff 100%)",
            }}
        >
            <div
                className="px-3 py-2 text-center text-white"
                style={{
                    backgroundColor: isPast ? "#6c757d" : "#0d6efd",
                    fontSize: "0.85rem",
                    letterSpacing: "0.5px",
                    fontWeight: "500",
                }}
            >
                {bookingDate.toLocaleDateString("sr-RS", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                })}
            </div>

            <Card.Body className="p-4 d-flex flex-column justify-content-between">
                <div>
                    <Card.Title
                        className="text-center mb-3 fw-semibold text-dark"
                        style={{ fontSize: "1.2rem" }}
                    >
                        {booking.schedule?.service?.title || "Nepoznata usluga"}
                    </Card.Title>

                    <div
                        className="p-3 mb-3"
                        style={{
                            backgroundColor: "#f1f5ff",
                            borderRadius: "10px",
                            fontSize: "0.9rem",
                        }}
                    >
                        <p className="mb-1">
                            👤 <b>Izvršilac:</b>{" "}
                            {booking.schedule?.service?.freelancer?.name ||
                                booking.schedule?.service?.company?.name ||
                                "Nepoznat"}
                        </p>
                        <p className="mb-0">
                            🏷️ <b>Status:</b>{" "}
                            <span
                                className={`fw-bold ${
                                    booking.status === "confirmed"
                                        ? "text-success"
                                        : booking.status === "pending"
                                            ? "text-warning"
                                            : "text-secondary"
                                }`}
                            >
                                {booking.status}
                            </span>
                        </p>
                    </div>

                    <div
                        className="text-center text-muted mb-3"
                        style={{ fontSize: "0.9rem" }}
                    >
                        ⏰ <b>Vreme:</b>{" "}
                        {(booking.schedule?.time_from || "").slice(0, 5)} –{" "}
                        {(booking.schedule?.time_to || "").slice(0, 5)}
                    </div>
                </div>

                {isPast ? (
                    <Button
                        variant="outline-primary"
                        className="w-100 mt-2"
                        style={{
                            borderRadius: "10px",
                            fontWeight: "500",
                        }}
                        onClick={() => onAddReview(booking)}
                    >
                        ⭐ Dodaj recenziju
                    </Button>
                ) : (
                    <Button
                        variant="outline-danger"
                        className="w-100 mt-2"
                        style={{
                            borderRadius: "10px",
                            fontWeight: "500",
                        }}
                        onClick={handleDelete}
                        disabled={deleting}
                    >
                        {deleting ? "Brisanje..." : "🗑️ Otkaži rezervaciju"}
                    </Button>
                )}
            </Card.Body>
        </Card>
    );
};

export default BookingCard;
