import { useState } from "react";
import axiosClient from "../axios-client";
import { Form, Button, Alert } from "react-bootstrap";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axiosClient.post("/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError("Neuspešno slanje linka za reset lozinke.");
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
                    />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100">
                    Pošalji link
                </Button>
            </Form>
            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </div>
    );
}
