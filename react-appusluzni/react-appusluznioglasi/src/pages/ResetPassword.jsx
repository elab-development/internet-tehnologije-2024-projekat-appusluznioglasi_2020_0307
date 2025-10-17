import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../axios-client";
import { Form, Button, Alert } from "react-bootstrap";

export default function ResetPassword() {
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const token = query.get("token");
    const emailFromQuery = query.get("email");

    const [email, setEmail] = useState(emailFromQuery || "");
    const [password, setPassword] = useState("");
    const [password_confirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const res = await axiosClient.post("/reset-password", {
                email,
                password,
                password_confirmation,
                token,
            });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 2000); // prebacuje na login
        } catch (err) {
            setError(err.response?.data?.message || "Greška prilikom resetovanja lozinke.");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h3>Resetuj lozinku</h3>
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Email adresa</Form.Label>
                    <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Nova lozinka</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Potvrdi lozinku</Form.Label>
                    <Form.Control
                        type="password"
                        value={password_confirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        required
                    />
                </Form.Group>
                <Button type="submit" variant="success" className="w-100">
                    Resetuj lozinku
                </Button>
            </Form>
            {message && <Alert variant="success" className="mt-3">{message}</Alert>}
            {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
        </div>
    );
}

