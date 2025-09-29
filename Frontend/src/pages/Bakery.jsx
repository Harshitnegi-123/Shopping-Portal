import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Bakery() {

    const navigate = useNavigate();
    const [bakeryProducts, setbakeryProducts] = useState([])
    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/products/category/bakery`)
            .then(res => setbakeryProducts(res.data))
            .catch(err => console.error(err))
    }, [])

    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/cart/add`,
                { productId, quantity: 1 },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            toast.success("Successfully added")
            console.log(res.data);

        } catch (error) {
            if (error.response && error.response.status === 401) {
                navigate("/"); // token invalid → login page
            } else {
                toast.error("Failed to add to cart ❌")
                console.error(error);
            }
        }
    };
    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">
            {/* <nav className="bg-yellow-300 px-6 py-4 flex justify-between items-center shadow">
                <div className="text-2xl font-bold text-gray-800">GrocerEase</div>
                <div className="flex items-center gap-6 text-base font-medium">
                    <a href="/home" className="text-gray-700 hover:text-yellow-700 transition">Home</a>
                    <a href="#" className="text-orange-700 font-semibold">Bakery</a>
                    <a href="/cart" className="text-gray-700 hover:text-yellow-700 transition">Cart</a>
                </div>
            </nav> */}

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-10 px-4 bg-yellow-50">
                <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 mb-3">Fresh Bakery Products</h1>
                <p className="text-lg text-gray-700 mb-4 max-w-xl">
                    Enjoy our range of freshly baked goods, perfect for every occasion and craving.
                </p>
            </section>

            {/* Bakery Grid */}
            <motion.section className="max-w-6xl mx-auto w-full p-4 flex-1"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Bakery Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {bakeryProducts.map((item) => (
                        <div key={item._id} className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col">
                            <Link to={`/product/${encodeURIComponent(item.name)}`}>
                                <img src={item.imgurl} alt={item.name} className="w-full h-48 object-cover" />
                            </Link>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{item.desc}</p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-yellow-700 font-bold text-lg">${item.price}</span>

                                    <button onClick={() => handleAddToCart(item._id)} className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition">Add to cart</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

            {/* Footer */}
            {/* <footer className="mt-12 py-6 text-center text-gray-400 text-sm border-t border-yellow-100">
                &copy; 2025 KiranaKart. Made by Harshit Negi.
            </footer> */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
                progressClassName="!bg-yellow-400"
            />
        </div>
    );
} 