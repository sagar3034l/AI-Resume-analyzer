import React, { useState } from 'react'
import {Link, useNavigate} from 'react-router'
import { useAuth } from '../Hooks/useAuth';

const register = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [name,setName] = useState("");

   const {loading,handleRegister} = useAuth()

   const navigate = useNavigate();

  async function handleSubmit(e){
     e.preventDefault();
     await handleRegister({email, password, name});
     navigate("/")
  }
  return (
    <main>
       <div className="form-container">
          <h1>Register</h1>
          <form onSubmit={handleSubmit}>
            <div className='input-group'>
              <label htmlFor="Name">Name</label>
              <input type="text" id='Name' placeholder='Name' value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className='input-group'>
              <label htmlFor="email">Email</label>
              <input type="email" id='email' placeholder='Enter email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className='input-group'>
              <label htmlFor="password">Password</label>
              <input type="password" id='password' placeholder='Enter password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          <button className='button'>Register</button>
          </form>
          <p style={{marginTop:"10px", textAlign:"center", textDecorationLine:"none"}}>Already have an account? <Link to={"/login"}>login</Link></p>
       </div>
  </main>
  )
}

export default register;