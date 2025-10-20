import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosClient from "../axios-client";
import { Row } from "react-bootstrap";
import ServiceCard from "../elements/ServiceCard.jsx";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Range } from "react-range";

const Services = () => {
    const [services, setServices] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    // Inicijalna cena ide do 100000, ali će se dinamički ažurirati
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [maxPrice, setMaxPrice] = useState(100000);
    const [ratingFilter, setRatingFilter] = useState(0);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("query") || "";

    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    // Fiksni korak za Range slider
    const PRICE_STEP = 100;

    // Učitavanje lokacija kompanija
    useEffect(() => {
        axiosClient
            .get(`/companies/locations`)
            .then(({ data }) => setCompanies(data))
            .catch((err) => console.error("Error fetching company locations:", err));
    }, []);

    // Učitavanje servisa
    useEffect(() => {
        axiosClient
            .get(`/services`, {
                params: { query: searchQuery, page, limit: 3 },
            })
            .then(({ data }) => {
                setServices((prev) => {
                    let updatedServices;

                    if (page === 1) {
                        updatedServices = data.services;
                    } else {
                        // **REŠENJE ZA DUPLIKATE KLJUČEVA:** Filtriramo duplikate
                        const existingIds = new Set(prev.map(s => s.id));
                        const filteredNewServices = data.services.filter(s => !existingIds.has(s.id));
                        updatedServices = [...prev, ...filteredNewServices];
                    }

                    // PRORAČUN MAX CENE (na osnovu SVIH servisa)
                    const allPrices = updatedServices.map((s) => s.price || 0);
                    const maxFound = allPrices.length > 0 ? Math.max(...allPrices) : 0;

                    // **REŠENJE ZA REACT-RANGE KONFLIKT:** // Osigurajte da je max cena za slider zaokružena na najbliži veći korak (100)
                    // (dodajemo 1 pre zaokruživanja da bi osigurali da je maxFound unutar opsega)
                    let newMaxPrice = Math.max(PRICE_STEP, Math.ceil((maxFound + 1) / PRICE_STEP) * PRICE_STEP);

                    setMaxPrice(newMaxPrice);

                    setPriceRange((prevRange) => {
                        // Ako je prva stranica ILI ako je trenutni filter postavljen ispod
                        // nove maksimalne cene, podesite gornju granicu filtera na novu maksimalnu cenu.
                        if (page === 1 || prevRange[1] < newMaxPrice) {
                            // Donja granica mora biti manja od gornje
                            let newLower = Math.min(prevRange[0], newMaxPrice);
                            return [newLower, newMaxPrice];
                        }
                        return prevRange;
                    });

                    return updatedServices;
                });

                setHasMore(data.hasMore);
            })
            .catch((err) => console.error(err));
    }, [searchQuery, page]);

    // Inicijalizacija i osvežavanje mape
    useEffect(() => {
        if (!companies.length || !mapContainerRef.current) return;

        if (mapInstanceRef.current) {
            // Ukloni samo markere
            mapInstanceRef.current.eachLayer((layer) => {
                if (layer instanceof L.Marker) {
                    mapInstanceRef.current.removeLayer(layer);
                }
            });
        } else {
            // Inicijalizacija mape
            mapInstanceRef.current = L.map(mapContainerRef.current).setView(
                [44.7866, 20.4489], // Beograd kao default centar
                7
            );

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(mapInstanceRef.current);
        }

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
            // Postavi pogled na sve markere
            mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50] });
        } else if (!mapInstanceRef.current._loaded) {
            // Ako nema markera, postavi defaultni pogled samo pri inicijalizaciji
            mapInstanceRef.current.setView(
                [44.7866, 20.4489],
                7
            );
        }

        return () => {
            // OVO JE KLJUČNO: Cleanup funkcija se poziva kada se komponenta uništi
            // Premeštanje uklanjanja mape u cleanup sprečava grešku _leaflet_pos
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    }, [companies]);

    // Filtriranje servisa na klijentu
    const filteredServices = services.filter(
        (s) =>
            (s.price || 0) >= priceRange[0] &&
            (s.price || 0) <= priceRange[1] &&
            (s.reviews_avg_rating || 0) >= ratingFilter
    );

    return (
        <div>
            <style>
                {/* CSS za stilizovanje */}
                {`
                    .map-container {
                        height: 400px;
                        width: 100%;
                        border-radius: 8px;
                        margin-top: 30px;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    }
                    .filter-container {
                        display: flex;
                        align-items: center;
                        gap: 50px;
                        flex-wrap: wrap;
                        margin-bottom: 25px;
                    }
                    .range-labels {
                        display: flex;
                        justify-content: space-between;
                        font-size: 14px;
                        width: 100%;
                        margin-top: 4px;
                    }
                `}
            </style>

            <h2>Usluge</h2>

            {/* FILTRI */}
            <div className="filter-container">
                {/* SLIDER ZA CENU */}
                <div style={{ width: "400px" }}>
                    <label className="form-label">
                        Cena (RSD): {priceRange[0]} - {priceRange[1]}
                    </label>
                    <Range
                        step={PRICE_STEP}
                        min={0}
                        max={maxPrice}
                        values={priceRange}
                        onChange={(values) => setPriceRange(values)}
                        renderTrack={({ props, children }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: "6px",
                                    width: "100%",
                                    background: `linear-gradient(to right, #ccc ${(priceRange[0] / maxPrice) * 100}%, #007bff ${(priceRange[0] / maxPrice) * 100}%, #007bff ${(priceRange[1] / maxPrice) * 100}%, #ccc ${(priceRange[1] / maxPrice) * 100}%)`,
                                    borderRadius: "3px",
                                }}
                            >
                                {children}
                            </div>
                        )}
                        renderThumb={({ props }) => (
                            <div
                                {...props}
                                style={{
                                    ...props.style,
                                    height: "18px",
                                    width: "18px",
                                    borderRadius: "50%",
                                    backgroundColor: "#007bff",
                                    boxShadow: "0 0 4px rgba(0,0,0,0.3)",
                                }}
                            />
                        )}
                    />
                    <div className="range-labels">
                        <span>Min (0)</span>
                        <span>Max ({maxPrice})</span>
                    </div>
                </div>

                {/* FILTER OCENE */}
                <div>
                    <label className="form-label">Minimalna ocena</label>
                    <select
                        className="form-select"
                        value={ratingFilter}
                        onChange={(e) => setRatingFilter(Number(e.target.value))}
                        style={{ width: "100px" }}
                    >
                        <option value={0}>Sve</option>
                        <option value={1}>1+</option>
                        <option value={2}>2+</option>
                        <option value={3}>3+</option>
                        <option value={4}>4+</option>
                        <option value={5}>5</option>
                    </select>
                </div>
            </div>

            {searchQuery && <h4>Rezultati za: {searchQuery}</h4>}

            <Row>
                {/* Prikaz filtriranih servisa. Ključevi su jedinstveni. */}
                {filteredServices.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </Row>

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

            <h3 className="mt-5 mb-3">Lokacije Vršilaca Usluga</h3>
            <div ref={mapContainerRef} style={{marginBottom:"3rem"}} className="map-container"></div>
        </div>
    );
};

export default Services;
