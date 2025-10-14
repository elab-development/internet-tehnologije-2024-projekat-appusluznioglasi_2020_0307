import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import axiosClient from "../axios-client.js";

const AppointmentList=({serviceId})=>{


    const navigate=useNavigate();
    const[schedules,setSchedules]=useState([]);
    const[loading,setLoading]=useState(true);
    const [booking,setBooking]=useState();

    const handleBooking=(scheduleId)=>{
        axiosClient.post(`bookings/create`,{schedule_id:scheduleId})
            .then(({data})=>{
                console.log(data);
                setBooking(data.booking);
            }).catch((err)=>{
                console.error("Gresla",err);
                alert("Doslo je do greske prilikom rezervacije")
            })
            .finally(()=>{navigate('/services')});

    };
    useEffect(()=>{
        if (!serviceId)navigate('/services');
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
        <div className="d-flex flex-column gap-3">
            {schedules.map((schedule)=>(
            <div
            key={schedule.id}
            className='border rounded p-3 shadow-sm d-flex justify-between align-items-center'>
                <div>
                    <h4 className='mb-1'><b>Datum: </b>{schedule.date}</h4>
                    <p className='mb-1'>Vreme: Od <b>{schedule.time_from}</b> do: <b>{schedule.time_to}</b></p>
                </div>
                <button className='btn btn-success' onClick={()=>handleBooking(schedule.id)}>Rezerviši</button>

            </div>
            ))}
        </div>


    );


}
export default AppointmentList
