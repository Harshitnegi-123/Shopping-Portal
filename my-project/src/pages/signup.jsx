import React, { useState } from "react";
import api from '../api'

const Signup = () => {
    const [formData, setformData] = useState({ username: ' ', email: ' ', password: ' ' })
    

    const handleChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e)=>{
        e.preventDefault()
        try {
            const res = await api.post('/api/auth/signup',formData)
            alert(res.data.message)
            
        } catch (error) {
            console.error(error.response.data.message || "Signup failed");
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="UserName" name="username" onChange={handleChange} />
            <input type="email" placeholder="Email" name="email" onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} />
            <button type="submit">Signup</button>
        </form>
    )
}

export default Signup