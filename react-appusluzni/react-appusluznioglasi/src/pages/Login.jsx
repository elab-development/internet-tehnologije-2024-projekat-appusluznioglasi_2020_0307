import React, { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
// Vraćamo originalne uvoze:
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';
// NAPOMENA: Pretpostavljam da su putanje '../contexts/ContextProvider' i '../axios-client' ispravne u Vašem projektu.

const Login = () => {
    const navigate = useNavigate()
    const emailRef = useRef()
    const passwordRef = useRef()
    const { setUser, setToken } = useStateContext()

    // Koristimo 'errors' za greške validacije i 'message' za opšte poruke
    const [errors, setErrors] = useState(null)
    const [message, setMessage] = useState(null)
    const [loading, setLoading] = useState(false) // Dodato stanje učitavanja

    const onSubmit = (ev) => {
        ev.preventDefault();

        // Resetujemo greške i poruke pre novog pokušaja
        setErrors(null);
        setMessage(null);
        setLoading(true);

        const payload = {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }

        axiosClient.post('/login', payload)
            .then(({ data }) => {
                setLoading(false);
                setUser(data.user)
                setToken(data.token);
                navigate('/home');
            })
            .catch((err) => {
                setLoading(false);
                const response = err.response;

                if (response) {
                    if (response.status === 422) {
                        // Postavljamo objekat grešaka iz servera
                        setErrors(response.data.errors)
                    }
                    else if (response.status === 400 || response.status === 401) {
                        setMessage(response.data.error)
                    }
                    else {
                        setMessage("Došlo je do neočekivane greške na serveru.");
                    }
                } else {
                    setMessage("Nema odgovora sa servera. Proverite Vašu internet vezu.");
                }
            })
    }

    return (
        <div className="login-signup-form animated fadeInDown">
            <div className="form">
                <form onSubmit={onSubmit}>
                    <h1 className="title">Prijavite se na Vaš nalog</h1>

                    {/* PRIKAZ STATUSNIH PORUKA (neispravni kredencijali, mreža, itd.) */}
                    {message &&
                        <div className="alert alert-error">
                            <p>{message}</p>
                        </div>
                    }

                    {/* PRIKAZ GREŠAKA VALIDACIJE (pojedinačne greške za polja 422) */}
                    {errors &&
                        <div className="alert alert-error">
                            {/* Prikazuje prvu poruku za svako polje koje ima grešku */}
                            {Object.keys(errors).map(key => (
                                <p key={key}>{errors[key][0]}</p>
                            ))}
                        </div>
                    }

                    <input ref={emailRef} type="email" placeholder="E-mail" disabled={loading} />
                    <input ref={passwordRef} type="password" placeholder="Lozinka" disabled={loading} />

                    <button className="btn btn-block" disabled={loading}>
                        {loading ? 'Učitavanje...' : 'Prijava'}
                    </button>

                    <p className="message">Niste registrovani? <Link to="/register">Kreirajte nalog</Link></p>
                    <p className="message">Zaboravljena lozinka?
                        <Link to="/forgot-password"> Restartujte lozinku</Link>
                    </p>
                </form>
            </div>

            <style jsx>{`
                .alert-error {
                    background-color: #fdd;
                    border: 1px solid #f99;
                    color: #900;
                }
                .alert {
                    padding: 10px;
                    margin-bottom: 15px;
                    border-radius: 4px;
                    font-size: 0.9rem;
                }
                .login-signup-form {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f4f6f8;
                }
                .form {
                    max-width: 400px;
                    margin-bottom: 300px;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .title {
                    text-align: center;
                    margin-bottom: 25px;
                    color: #333;
                    font-size: 1.8rem;
                }
                input {
                    width: 100%;
                    padding: 12px;
                    margin-bottom: 15px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    box-sizing: border-box;
                    transition: border-color 0.3s;
                }
                input:focus {
                    border-color: #4f46e5;
                    outline: none;
                }
                .btn {
                    background-color: #4f46e5;
                    color: white;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 1rem;
                    transition: background-color 0.3s;
                }
                .btn:hover:not(:disabled) {
                    background-color: #4338ca;
                }
                .btn:disabled {
                    background-color: #a5b4fc;
                    cursor: not-allowed;
                }
                .btn-block {
                    display: block;
                    width: 100%;
                }
                .message {
                    margin-top: 20px;
                    text-align: center;
                    color: #555;
                }
                .message a {
                    color: #4f46e5;
                    text-decoration: none;
                }
                .message a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    )
}

export default Login
