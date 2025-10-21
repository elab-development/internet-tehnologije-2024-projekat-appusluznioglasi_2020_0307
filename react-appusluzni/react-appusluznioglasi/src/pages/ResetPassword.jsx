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
    const [validationErrors, setValidationErrors] = useState(null); // ✅ dodato

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setValidationErrors(null); // reset validacionih grešaka

        try {
            const res = await axiosClient.post("/reset-password", {
                email,
                password,
                password_confirmation,
                token,
            });

            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            const response = err.response;
            if (response && response.status === 422) {
                setValidationErrors(response.data.errors);
            } else if (response && response.status === 400) {
                setError(response.data.message);
            } else {
                setError("Došlo je do nepoznate greške na serveru.");
            }
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
                    {validationErrors?.email && (
                        <div className="text-danger small mt-1">{validationErrors.email[0]}</div>
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Nova lozinka</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {validationErrors?.password && (
                        <div className="text-danger small mt-1">{validationErrors.password[0]}</div>
                    )}
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

