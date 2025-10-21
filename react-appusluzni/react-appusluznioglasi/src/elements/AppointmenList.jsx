import axiosClient from "../axios-client.js";
import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";

const AppointmentList = ({ serviceId, onClose, refreshBookings }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [booking, setBooking] = useState(null);

    const handleBooking = (scheduleId) => {
        axiosClient.post(`/bookings/create`, { schedule_id: scheduleId })
            .then(({ data }) => {
                console.log("✅ Booking created:", data.booking);
                setBooking(data.booking);
                if (refreshBookings) refreshBookings();


                if (location.pathname === "/home") {
                    if (refreshBookings) refreshBookings();
                    if (onClose) onClose();
                } else {
                    navigate("/home");
                }
            })
            .catch((err) => {
                console.error("❌ Greška prilikom rezervacije:", err);
                alert("Došlo je do greške prilikom rezervacije.");
            });
    };

    useEffect(() => {
        if (!serviceId) {
            navigate("/home");
            return;
        }

        axiosClient.get(`/schedules/service/${serviceId}`)
            .then(({ data }) => {
                setSchedules(data.schedules);
            })
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, [serviceId, navigate]);

    if (loading) return <h2>Učitavanje...</h2>;
    if (schedules.length === 0) return <h3>Nema dostupnih termina</h3>;

    return (
        <div className="d-flex flex-column gap-4">
            {schedules.map((schedule) => (
                <div
                    key={schedule.id}
                    className="border rounded-4 p-4 shadow-lg bg-light d-flex justify-content-between align-items-center"
                    style={{ borderColor: "#e0e0e0", transition: "all 0.3s ease-in-out" }}
                >
                    <div>
                        <h5 className="fw-bold text-primary mb-2">
                            📅 Datum: <span className="text-dark">{schedule.date}</span>
                        </h5>
                        <p className="mb-0 text-secondary">
                            ⏰ Vreme: od <b>{schedule.time_from}</b> do <b>{schedule.time_to}</b>
                        </p>
                    </div>
                    <button
                        className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
                        onClick={() => handleBooking(schedule.id)}
                    >
                        ✅ Rezerviši
                    </button>
                </div>
            ))}
        </div>
    );
};

export default AppointmentList;

