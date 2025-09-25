import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";
export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Animation variants for form elements
    const formVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            const url = isLogin ? '/api/auth/login' : '/api/auth/signup';
            const res = await API.post(url, formData);
            setSuccess(res.data.message);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            console.log("Login/Signup API response:", res.data);


            // Delay navigation for a better UX
            setTimeout(() => {
                if (res.data.role === "admin") {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/home");
                }

            }, 1000);
        } catch (error) {
            console.log(error);
            const message = error?.response?.data?.message || (isLogin ? "Login failed" : "Registration failed");
            setError(message);
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left Side - Form */}
                <div className="md:w-1/2 flex items-center justify-center p-6 md:p-12">
                    <motion.div
                        key={isLogin ? "login" : "signup"}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border-2 border-yellow-200 relative overflow-hidden"
                    >
                        {/* Decorative elements */}
                        <div className="absolute -top-16 -right-16 w-32 h-32 bg-yellow-100 rounded-full opacity-70"></div>
                        <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-yellow-100 rounded-full opacity-70"></div>

                        <div className="relative z-10">
                            <motion.h2
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-3xl font-bold text-center mb-8 text-yellow-800"
                            >
                                {isLogin ? "Welcome Back!" : "Create Account"}
                            </motion.h2>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center"
                                >
                                    {error}
                                </motion.div>
                            )}

                            {success && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-6 p-3 bg-green-50 border border-green-200 text-green-600 rounded-xl text-sm text-center"
                                >
                                    {success}
                                </motion.div>
                            )}

                            <form onSubmit={handleSubmit}>
                                {!isLogin && (
                                    <motion.div
                                        custom={0}
                                        variants={formVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="mb-5"
                                    >
                                        <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Enter your username"
                                                value={formData.username}
                                                name="username"
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 border-2 border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition bg-yellow-50"
                                                required
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                <motion.div
                                    custom={!isLogin ? 1 : 0}
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="mb-5"
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="email"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            name="email"
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition bg-yellow-50"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    custom={!isLogin ? 2 : 1}
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                    className="mb-6"
                                >
                                    <label className="block text-sm font-medium text-gray-700 mb-1 ml-1">Password</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            name="password"
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border-2 border-yellow-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition bg-yellow-50"
                                            required
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    custom={!isLogin ? 3 : 2}
                                    variants={formVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-3 px-4 rounded-xl text-yellow-900 font-bold text-lg shadow-lg transform transition duration-300 ${loading ? 'bg-yellow-300 cursor-not-allowed' : 'bg-yellow-400 hover:bg-yellow-500 hover:scale-105'}`}
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-t-2 border-b-2 border-yellow-900 rounded-full animate-spin mr-2"></div>
                                                {isLogin ? "Logging in..." : "Creating account..."}
                                            </div>
                                        ) : (
                                            isLogin ? "Login" : "Create Account"
                                        )}
                                    </button>
                                </motion.div>
                            </form>

                            <motion.div
                                custom={!isLogin ? 4 : 3}
                                variants={formVariants}
                                initial="hidden"
                                animate="visible"
                                className="mt-8 text-center"
                            >
                                <p className="text-gray-600">
                                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                                    <button
                                        onClick={() => {
                                            setIsLogin(!isLogin);
                                            setError("");
                                            setSuccess("");
                                        }}
                                        className="text-yellow-700 ml-2 font-semibold hover:underline focus:outline-none"
                                        type="button"
                                    >
                                        {isLogin ? "Sign up" : "Login"}
                                    </button>
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Side - Illustration */}
                <div className="md:w-1/2 bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center p-6 md:p-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="text-center max-w-md"
                    >
                        <div className="mb-8 flex justify-center">
                            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                        </div>
                        <h1 className="text-4xl font-extrabold text-yellow-900 mb-4">
                            {isLogin ? "Welcome Back!" : "Join GrocerEase Today!"}
                        </h1>
                        <p className="text-lg text-yellow-800 mb-8">
                            {isLogin
                                ? "Sign in to access your account and continue your shopping journey with us."
                                : "Create an account to start shopping for fresh groceries delivered to your doorstep."}
                        </p>
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <div className="bg-white bg-opacity-30 p-4 rounded-xl shadow-md">
                                <div className="text-yellow-900 font-bold mb-1">Fast Delivery</div>
                                <div className="text-sm text-yellow-800">Right to your doorstep</div>
                            </div>
                            <div className="bg-white bg-opacity-30 p-4 rounded-xl shadow-md">
                                <div className="text-yellow-900 font-bold mb-1">Fresh Products</div>
                                <div className="text-sm text-yellow-800">Quality guaranteed</div>
                            </div>
                            <div className="bg-white bg-opacity-30 p-4 rounded-xl shadow-md">
                                <div className="text-yellow-900 font-bold mb-1">Secure Checkout</div>
                                <div className="text-sm text-yellow-800">Safe & reliable</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Footer */}
            {/* <footer className="py-6 text-center text-gray-400 text-sm border-t border-yellow-100 bg-white">
                &copy; 2024 GrocerEase. All rights reserved.
            </footer> */}
        </div>
    );
}
