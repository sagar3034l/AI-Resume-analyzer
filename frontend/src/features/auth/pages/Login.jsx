import React, { useState } from 'react'
import './auth.form.scss'
import '../../../style/button.scss'
import { useAuth } from '../Hooks/useAuth';
import { toast } from 'react-hot-toast'
import { useNavigate } from 'react-router';



const login = () => {
  const { handleLogin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if(!email || !password){
       toast.error("Fill the values")
    }
    const res = await handleLogin({ email, password })
    console.log(res)
    if(res){
       navigate("/")
    }
  }

  return (
    <main>
      <div className="form-container">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <div className='input-group'>
            <label htmlFor="email">Email</label>
            <input type="email" id='email' placeholder='Enter email' onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className='input-group'>
            <label htmlFor="password">Password</label>
            <input type="password" id='password' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button className='button'>{loading ? "loading..." : "Submit"}</button>
        </form>
      </div>
    </main>
  )
}

export default login