import React, { useRef, useState } from 'react'
import {Link, useNavigate} from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';
import axiosClient from '../axios-client';

const Login = () => {
    const navigate=useNavigate()
    const emailRef = useRef()
    const passwordRef = useRef()
    const { setUser, setToken } = useStateContext()
    const [message, setMessage] = useState(null)


  const onSubmit=(ev)=>{
    ev.preventDefault();
    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);

              navigate('/home');

      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 400) {
          console.log(response.data.message)
          setMessage(response.data.message)
        }
      })
  }

  return (
      <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>

          {/* {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          } */}
          {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }

          <input ref={emailRef} type="email" placeholder="Email"/>
          <input ref={passwordRef} type="password" placeholder="Password"/>
          <button className="btn btn-block">Login</button>
          <p className="message">Not registered? <Link to="/register">Create an account</Link></p>

            <p className="message">Zaboravljena lozinka?<Link to="/forgot-password">
               Restartuj lozinku
            </Link></p>

        </form>
      </div>

    </div>
  )
}

export default Login

