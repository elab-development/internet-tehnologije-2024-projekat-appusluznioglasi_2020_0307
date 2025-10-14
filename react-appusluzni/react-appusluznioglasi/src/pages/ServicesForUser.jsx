import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../axios-client';

const Services = () => {
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const location = useLocation();

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';

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
                        <p>Ocena: {service.reviews_avg_rating}</p>
                        <p>Raspolozivo izvrsilaca: {service.company==null?1:service.max_employees}</p>
                        <p>Izvršilac: {service.company==null?service.freelancer.name:service.company.name}</p>
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
        </div>
    );
};

export default Services;
