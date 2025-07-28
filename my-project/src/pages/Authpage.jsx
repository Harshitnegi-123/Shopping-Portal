import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import API from "../api";
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({ username: "", email: "", password: "" })
    const navigate = useNavigate()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const url = isLogin ? '/api/auth/login' : '/api/auth/register'
            const res = await API.post(url, formData)
            alert(res.data.message)
            localStorage.setItem("token", res.data.token)
            navigate('/dashboard')
        } catch (error) {
            console.log(error)
            const message = error?.res?.data?.message || "Login failed"
            alert(message)
        }
    }


    return (
        <div className="h-screen flex">
            <div className="w-1/2 flex items-center justify-center bg-white relative overflow-hidden">
                <motion.div
                    key={isLogin ? "login" : "signup"}
                    initial={{ x: 300, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -300, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white p-8 rounded-2xl shadow-lg w-96"
                >
                    <h2 className="text-2xl font-semibold text-center mb-6">
                        {isLogin ? "Login" : "Sign Up"}
                    </h2>

                    <div className="text-center text-gray-500">{<form onSubmit={handleSubmit} >
                        {!isLogin && (
                            <input type="text" placeholder="UserName" value={formData.username} name="username" onChange={handleChange} className="w-full mb-4 p-3 border rounded-xl focus:ouline-none focus:ring-2 focus:ring-blue-400 transition" />
                        )}

                        <input type="email" placeholder="Email" value={formData.email} name="email" onChange={handleChange} className="w-full mb-4 p-3 border rounded-xl focus:ouline-none focus:ring-2 focus:ring-blue-400 transition" />

                        <input type="password" placeholder="Password" value={formData.password} name="password" onChange={handleChange} className="w-full mb-4 p-3 border rounded-xl focus:ouline-none focus:ring-2 focus:ring-blue-400 transition" />

                        <button type="submit" className="w-full mb-4 p-2 text-white bg-blue-500 hover:bg-blue-600">Login</button>
                    </form>}</div>

                    <p className="mt-6 text-sm text-center">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-600 ml-2 font-semibold hover:underline"
                        >
                            {isLogin ? "Sign up" : "Login"}
                        </button>
                    </p>
                </motion.div>
            </div>

            <div className="w-1/2 bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center">
                <h1 className="text-4xl font-bold text-blue-800">Welcome Back!</h1>
            </div>
        </div>
    );
}
