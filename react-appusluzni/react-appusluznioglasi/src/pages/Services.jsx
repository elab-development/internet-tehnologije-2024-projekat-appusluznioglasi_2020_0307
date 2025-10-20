import { useEffect, useState } from "react";
import { useStateContext } from "../contexts/ContextProvider";
import axiosClient from "../axios-client";
import { Button, Form, Modal, Row } from "react-bootstrap";
import ServiceCard from "../elements/ServiceCard.jsx";

const Services = () => {
    const { user } = useStateContext();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingService, setEditingService] = useState(null);
    const [form, setForm] = useState({
        title: "",
        description: "",
        price: "",
        max_employees: 1,
        image: null,
    });

    useEffect(() => {
        if (!user) return;

        axiosClient
            .get("/services/my-services")
            .then(({ data }) => {
                setServices(data.services || []);
            })
            .catch((err) => {
                console.error("Greška pri učitavanju usluga:", err);
            })
            .finally(() => setLoading(false));
    }, [user]);

    // Otvaranje modala za dodavanje
    const handleAdd = () => {
        setEditingService(null);
        setForm({
            title: "",
            description: "",
            price: "",
            max_employees: 1,
            image: null,
        });
        setShowModal(true);
    };

    // Otvaranje modala za izmenu
    const handleEdit = (service) => {
        setEditingService(service);
        setForm({
            title: service.title,
            description: service.description,
            price: service.price,
            max_employees: service.max_employees,
            image: null, // novi fajl ako se menja
        });
        setShowModal(true);
    };

    // Brisanje usluge
    const handleDelete = async (id) => {
        if (!window.confirm("Da li ste sigurni da želite da obrišete ovu uslugu?")) return;
        try {
            await axiosClient.delete(`/services/${id}`);
            setServices((prev) => prev.filter((s) => s.id !== id));
        } catch (err) {
            console.error("Greška pri brisanju usluge:", err);
            alert("Došlo je do greške pri brisanju usluge.");
        }
    };

    // Promena inputa u formi
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    // Promena fajla
    const handleFileChange = (e) => {
        setForm((prev) => ({ ...prev, image: e.target.files[0] }));
    };

    // Slanje forme (dodavanje ili izmena)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.entries(form).forEach(([key, value]) => {
            if (value !== null) formData.append(key, value);
        });

        try {
            let data;
            if (editingService) {
                // Izmena
                const res = await axiosClient.put(`/services/${editingService.id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                data = res.data;
                setServices((prev) =>
                    prev.map((s) => (s.id === editingService.id ? { ...s, ...form } : s))
                );
                alert("Usluga uspešno izmenjena!");
            } else {
                // Dodavanje nove usluge
                const res = await axiosClient.post("/services", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                data = res.data;
                setServices((prev) => [...prev, data.data || data.service]);
                alert("Usluga uspešno dodata!");
            }

            setShowModal(false);
        } catch (err) {
            console.error("Greška:", err);
            alert("Došlo je do greške pri čuvanju usluge.");
        }
    };

    if (loading) return <p>Učitavanje usluga...</p>;

    return (
        <div>
            <h2 className="mb-3">Moje usluge</h2>

            {services.length === 0 ? (
                <p>Trenutno nemate dodate usluge.</p>
            ) : (
                <Row className="g-3">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            service={service}
                            onDelete={() => handleDelete(service.id)}
                            onEdit={() => handleEdit(service)}
                        />
                    ))}
                </Row>
            )}

            <div className="text-center mt-4">
                <Button variant="primary" onClick={handleAdd}>
                    Dodaj novu uslugu
                </Button>
            </div>

            {/* MODAL ZA FORMU */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{editingService ? "Izmeni uslugu" : "Dodaj novu uslugu"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} encType="multipart/form-data">
                        <Form.Group className="mb-3">
                            <Form.Label>Naziv</Form.Label>
                            <Form.Control
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Opis</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                rows={3}
                                value={form.description}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cena (€)</Form.Label>
                            <Form.Control
                                type="number"
                                name="price"
                                value={form.price}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Maks. zaposlenih</Form.Label>
                            <Form.Control
                                type="number"
                                name="max_employees"
                                value={form.max_employees}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Slika</Form.Label>
                            <Form.Control type="file" onChange={handleFileChange} />
                        </Form.Group>

                        <div className="text-end">
                            <Button
                                variant="secondary"
                                onClick={() => setShowModal(false)}
                                className="me-2"
                            >
                                Otkaži
                            </Button>
                            <Button variant="primary" type="submit">
                                {editingService ? "Sačuvaj izmene" : "Dodaj"}
                            </Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default Services;
