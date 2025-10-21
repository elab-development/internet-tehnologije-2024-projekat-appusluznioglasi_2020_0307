import { useState } from "react";
import axiosClient from "../axios-client";
import { Form, Button, Alert, Spinner } from "react-bootstrap";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); // 👈 novi state

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        setLoading(true); // 👈 uključi loading

        try {
            const res = await axiosClient.post("/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError("Neuspešno slanje linka za reset lozinke.");
        } finally {
            setLoading(false); // 👈 isključi loading uvek
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3>Zaboravljena lozinka</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email adresa</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Unesite svoj email"
                        required
                        disabled={loading} // 👈 onemogući input dok traje zahtev
                    />
                </Form.Group>
                <Button
                    type="submit"
                    variant="primary"
                    className="w-100"
                    disabled={loading} // 👈 onemogući dugme dok traje zahtev
                >
                    {loading ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-2"
                            />
                            Slanje...
                        </>
                    ) : (
                        "Pošalji link"
                    )}
                </Button>
            </Form>

            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </div>
    );
}
