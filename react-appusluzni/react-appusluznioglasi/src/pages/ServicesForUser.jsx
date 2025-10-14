import React, {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../axios-client';
import {Modal} from "react-bootstrap";
import AppointmentList from "./AppointmenList.jsx";

const Services = () => {
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';
    const [selectedService,setSelectedService]=useState(null);
    const [showModal,setShowModal]=useState(false);
    const handleShowAppointments=(service)=>{
        setSelectedService(service);
        setShowModal(true);
    }


    useEffect(() => {
        axiosClient.get(`/services`, {
            params: { query: searchQuery, page, limit: 6 }
        })
            .then(({ data }) => {
                setServices(data.services);
                console.log(data.services);
                setHasMore(data.hasMore);
            })
            .catch(err => console.error(err));
    }, [searchQuery, page]);

    return (
        <div>
            <h2>Usluge</h2>
            {searchQuery && <h4>Rezultati za: {searchQuery}</h4>}

            <div className="d-flex flex-wrap gap-3">
                {services.map(service => (
                    <div key={service.id} className="p-3 border rounded shadow-sm">
                        <h5>{service.name}</h5>
                        <h6 align={'center'}>{service.title}</h6>
                        <p>Cena: {service.price} RSD</p>
                        <p>Ocena: {service.reviews_avg_rating===0?'Nema ocena':service.reviews_avg_rating}</p>
                        <p>Raspolozivo izvrsilaca: {service.company==null?1:service.max_employees}</p>
                        <p>Izvršilac: {service.company==null?service.freelancer.name:service.company.name}</p>
                        <button onClick={()=>handleShowAppointments(service)}>Pogledaj dostupne termine</button>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="text-center mt-3">
                    <button className="btn btn-primary" onClick={() => setPage(prev => prev + 1)}>
                        Vidi još
                    </button>
                </div>
            )}
            <Modal show={showModal} onHide={()=>setShowModal(false)} size="lg" centered={true}>
                <Modal.Header closeButton>
                    <Modal.Title>Dostupni termini za :{selectedService?.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedService?(
                        <AppointmentList serviceId={selectedService?.id}></AppointmentList>
                    ):(
                        <p>Ucitavanje...</p>
                    )}
                </Modal.Body>
            </Modal>
        </div>

    );
};

export default Services;
