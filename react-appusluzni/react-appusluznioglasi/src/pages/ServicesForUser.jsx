import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../axios-client";
import { Row } from "react-bootstrap";
import ServiceCard from "./ServiceCard.jsx";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const Services = () => {
    const [services, setServices] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 });
    const [ratingFilter, setRatingFilter] = useState(0);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";

    // Ref za DOM element mape
    const mapContainerRef = useRef(null);
    // Ref za Leaflet instancu mape
    const mapInstanceRef = useRef(null);

    // Učitavanje lokacija kompanija
    useEffect(() => {
        axiosClient
            .get(`/companies/locations`)
            .then(({ data }) => setCompanies(data))
            .catch((err) => console.error("Error fetching company locations:", err));
    }, []);

    // Inicijalizacija mape
    useEffect(() => {
        if (!companies.length || !mapContainerRef.current) return;

        // Ako mapa već postoji, očisti markere
        if (mapInstanceRef.current) {
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapInstanceRef.current.removeLayer(layer);
                }
            });
        } else {
            // Kreiraj mapu samo jednom
            mapInstanceRef.current = L.map(mapContainerRef.current).setView(
                [44.7866, 20.4489], // Beograd
                7
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstanceRef.current);
        }

        // Dodavanje markera
        const bounds = [];
        companies.forEach((company) => {
            if (company.latitude && company.longitude) {
                const marker = L.marker([company.latitude, company.longitude]).addTo(
                    mapInstanceRef.current
                );
                marker.bindPopup(
                    `<b>${company.name}</b><br>${company.description || "Vršilac usluga"}`
                );
                bounds.push([company.latitude, company.longitude]);
            }
        });

        if (bounds.length > 0) {
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        }

        // Čišćenje prilikom unmount-a
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [companies]);

    // Učitavanje servisa
    useEffect(() => {
        axiosClient
            .get(`/services`, {
                params: { query: searchQuery, page, limit: 3 },
            })
            .then(({ data }) => {
                setServices(data.services);
                setHasMore(data.hasMore);
            })
            .catch((err) => console.error(err));
    }, [searchQuery, page]);

    // Filtriranje servisa
    const filteredServices = services.filter(
        (s) =>
            s.price >= priceFilter.min &&
            s.price <= priceFilter.max &&
            s.reviews_avg_rating >= ratingFilter
    );

    return (
        <div>
            <style>
                {`
                    .map-container {
                        height: 400px;
                        width: 100%;
                        border-radius: 8px;
                        margin-top: 30px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .leaflet-popup-content-wrapper {
                        border-radius: 8px;
                    }
                `}
            </style>

            <h2>Usluge</h2>

            {/* Filtriranje po ceni */}
            <div className="d-flex align-items-center gap-3 mb-3">
                <div>
                    <label className="form-label">Cena (RSD)</label>
                    <div className="d-flex gap-2">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Min"
                            value={priceFilter.min}
                            onChange={(e) =>
                                setPriceFilter((prev) => ({
                                    ...prev,
                                    min: Number(e.target.value),
                                }))
                            }
                            style={{ width: "80px" }}
                        />
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Max"
                            value={priceFilter.max}
                            onChange={(e) =>
                                setPriceFilter((prev) => ({
                                    ...prev,
                                    max: Number(e.target.value),
                                }))
                            }
                            style={{ width: "80px" }}
                        />
                    </div>
                </div>
            </div>

            {/* Filtriranje po oceni */}
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

            {/* Lista servisa */}
            <div>
                <Row>
                    {filteredServices.map((service) => (
                        <ServiceCard key={service.id} service={service} />
                    ))}
                </Row>
            </div>

            {/* Dugme za učitavanje još */}
            {hasMore && (
                <div className="text-center mt-3">
                    <button
                        className="btn btn-primary"
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Vidi još
                    </button>
                </div>
            )}

            {/* Mapa sa lokacijama */}
            <h3 className="mt-5 mb-3">Lokacije Vršilaca Usluga</h3>
            <div ref={mapContainerRef} className="map-container"></div>
        </div>
    );
};

export default Services;
