import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axiosClient from "../axios-client.js";

const AppointmentList=({serviceId})=>{


    const navigate=useNavigate();
    const[schedules,setSchedules]=useState([]);
    const[loading,setLoading]=useState(true);
    const [booking,setBooking]=useState();

    const handleBooking=(scheduleId)=>{
        axiosClient.post(`/bookings/create`,{schedule_id:scheduleId})
            .then(({data})=>{
                console.log(data);
                setBooking(data.booking);
            }).catch((err)=>{
                console.error("Gresla",err);
                alert("Doslo je do greske prilikom rezervacije")
            })
            .finally(()=>{navigate('/home')});

    };
    useEffect(()=>{
        if (!serviceId)navigate('/home');
        axiosClient.get(`/schedules/service/${serviceId}`)
            .then(({data})=>{
                console.log(data);
                setSchedules(data.schedules);
            })
            .catch((err)=>console.error(err))
            .finally(()=>setLoading(false));
    },[serviceId]);
    if (loading)return <h2>Ucitavanje...</h2>
    if (schedules.length===0){
        return <h3>Nema dostupnih termina</h3>
    }
    return(
        <div className="d-flex flex-column gap-4">
            {schedules.map((schedule) => (
                <div
                    key={schedule.id}
                    className="border rounded-4 p-4 shadow-lg bg-light d-flex justify-content-between align-items-center hover-shadow transition"
                    style={{
                        borderColor: "#e0e0e0",
                        transition: "all 0.3s ease-in-out",
                    }}
                >
                    <div>
                        <h5 className="fw-bold text-primary mb-2">
                            📅 Datum: <span className="text-dark">{schedule.date}</span>
                        </h5>
                        <p className="mb-0 text-secondary">
                            ⏰ Vreme: od{" "}
                            <b className="text-dark">{schedule.time_from}</b> do{" "}
                            <b className="text-dark">{schedule.time_to}</b>
                        </p>
                    </div>
                    <button
                        className="btn btn-success px-4 py-2 rounded-pill shadow-sm"
                        onClick={() => handleBooking(schedule.id)}
                        style={{ transition: "all 0.2s ease-in-out" }}
                        onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.05)")
                        }
                        onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
                    >
                        ✅ Rezerviši
                    </button>
                </div>
            ))}
        </div>

    );


}
export default AppointmentList
