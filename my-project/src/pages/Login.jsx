import React, { useState } from "react";
import Navbar from "../component/Navbar";
import { useNavigate } from "react-router-dom";

import API from "../api";
const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const navigate = useNavigate()
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await API.post('/api/auth/login', formData)
            alert(res.data.message)
            localStorage.setItem("token",res.data.token)
            navigate('/dashboard')
        } catch (error) {
            console.log(error.response.data.message || "Login failed")
        }
    }

    return (
        <>
        <Navbar/>
        <form onSubmit={handleSubmit} >
            <h2>Login</h2>
            <input type="email" placeholder="Email" name="email" onChange={handleChange} required />
            <input type="password" placeholder="Password" name="password" onChange={handleChange} required />
            <button type="submit">Login</button>
        </form>
        </>
    )
}
export default Login