import React, {useEffect, useRef, useState} from 'react';
import { useLocation } from 'react-router-dom';
import axiosClient from '../axios-client';
import {Modal, Row} from "react-bootstrap";
import AppointmentList from "./AppointmenList.jsx";
import ServiceListWithReviews from "./ServiceCard.jsx";
import ServiceCard from "./ServiceCard.jsx";

const Services = () => {
    const [services, setServices] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const location = useLocation();
    const [priceFilter,setPriceFilter]=useState({min:0,max:1000});
    const [ratingFilter,setRatingFilter]=useState(0);

    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get('query') || '';



    useEffect(() => {
        axiosClient.get(`/services`, {
            params: { query: searchQuery, page, limit: 3 }
        })
            .then(({ data }) => {
                setServices(data.services);
                console.log(data.services);
                setHasMore(data.hasMore);
            })
            .catch(err => console.error(err));
    }, [searchQuery, page]);

    const filteredServices = services.filter(
        (s) =>
            s.price >= priceFilter.min &&
            s.price <= priceFilter.max &&
            s.reviews_avg_rating >= ratingFilter
    );

    return (
        <div>
            <h2>Usluge</h2>
            <div className='d-flex align-items-center gap-3 mb-3'>
                <div>
                    <label className="form-label">Cena (RSD)</label>
                    <div className='d-flex gap-2'>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Min"
                            value={priceFilter.min}
                            onChange={(e) =>
                                setPriceFilter((prev) => ({ ...prev, min: Number(e.target.value) }))
                            }
                            style={{ width: "80px" }}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Max"
                            value={priceFilter.max}
                            onChange={(e) =>
                                setPriceFilter((prev) => ({ ...prev, max: Number(e.target.value) }))
                            }
                            style={{ width: "80px" }}
                        />
                    </div>
                </div>
            </div>
            <div>
                <label className="form-label">Minimalna ocena</label>
                <select
                    className="form-select"
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                >
                    <option value={0}>Sve</option>
                    <option value={1}>1+</option>
                    <option value={2}>2+</option>
                    <option value={3}>3+</option>
                    <option value={4}>4+</option>
                    <option value={5}>5</option>
                </select>
            </div>
            {searchQuery && <h4>Rezultati za: {searchQuery}</h4>}

            <div >
                <Row>
                    {filteredServices.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                        />
                    ))}
                </Row>
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
