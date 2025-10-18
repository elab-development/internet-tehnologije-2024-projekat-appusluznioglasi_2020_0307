import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import axiosClient from '../axios-client';
import { useStateContext } from '../contexts/ContextProvider';

const Register = () => {

  const nameRef=useRef();
  const emailRef=useRef();
  const passwordRef=useRef();
  const roleRef=useRef();
  const companyNameRef = useRef();
  const descriptionRef = useRef();
  const {setUser,setToken}=useStateContext();
  const [role, setRole] = useState('user');
  const [errors, setErrors] = useState(null)
    const addressRef = useRef();


    const onSubmit=(ev)=>{
    ev.preventDefault();
    const payload={
      name:nameRef.current.value,
      email:emailRef.current.value,
      password:passwordRef.current.value,
      role:role

    }
    if (role === 'company') {
      payload.company_name = companyNameRef.current.value;
      payload.description = descriptionRef.current.value;
      payload.badge_verified = false;
      payload.address=addressRef.current.value;
    }


    console.log(payload);
    axiosClient.post("/register",payload).then(({data})=>{
      setToken(data.token)
      setUser(data.user)
        if (data.user.role === 'user') {
            navigate('/home');
        } else if (data.user.role === 'freelancer'||data.user.role==='company') {
            navigate('/homeCompanyFrelanceer');
        }

    })

    .catch(err=>{
      const response=err.response;

      if(response&&response.status === 400){

        console.error("Register error:", response.data);
        setErrors(response.data.errors)
        console.log(errors);
      }
    })
  }

  return (
     <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Register for free</h1>


            {/* {errors &&
            <div className="alert">
              {Object.keys(errors).map(key => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          } */}

          <input ref={nameRef} type="text" placeholder="Name"/>

          <input ref={emailRef} type="email" placeholder="Email"/>

          <input ref={passwordRef} type="password" placeholder="Password"/>

           <div className="role-group">
  <label>
    <input
      type="radio"
      name="role"
      value="user"
      checked={role === 'user'}
      onChange={(e) => setRole(e.target.value)}
    />
    <span>User</span>
  </label>

  <label>
    <input
      type="radio"
      name="role"
      value="freelancer"
      checked={role === 'freelancer'}
      onChange={(e) => setRole(e.target.value)}
    />
    <span>Freelancer</span>
  </label>

  <label>
    <input
      type="radio"
      name="role"
      value="company"
      checked={role === 'company'}
      onChange={(e) => setRole(e.target.value)}
    />
    <span>Company</span>
  </label>
</div>


          {role === 'company' && (
            <div>
              <input
                ref={companyNameRef}
                type="text"
                placeholder="Company name"
                required={role === 'company'}
              />
                <input
                    ref={addressRef}
                    type="text"
                    placeholder="Company Address"
                    required
                />
              <textarea
                ref={descriptionRef}
                placeholder="Company description (optional)"
                rows="3"
                style={{ resize: 'none' }}
              />
            </div>
          )}

          <button className="btn btn-block">Register</button>
          <p className="message">Already regitered. <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Register
