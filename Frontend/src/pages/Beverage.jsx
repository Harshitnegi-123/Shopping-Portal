import React from "react";
import { motion } from "framer-motion";
import { ToastContainer, toast, Bounce } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Beverage() {
    const navigate = useNavigate();
    const [beverageProducts, setbeverageProducts] = useState([])
    const [loading, setloading] = useState(true)
    useEffect(() => {
        setloading(true)
        axios.get(`${import.meta.env.VITE_BASE_URL}/api/products/category/beverages`)
            .then(res => {
                setdairyProducts(res.data)
                setloading(false)
            })
            .catch(err => {
                console.error(err)
                setloading(false)
            })
    }, [])

    const handleAddToCart = async (productId) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/");
                return;
            }

            const res = await axios.post(
                `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
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
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1 // Each child 0.1s delay se aayega
            }
        }
    }

    const cardVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    }
    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">
            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-10 px-4 bg-yellow-50">
                <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 mb-3">Fresh Dairy Products</h1>
                <p className="text-lg text-gray-700 mb-4 max-w-xl">
                    Browse our selection of fresh, high-quality dairy products delivered to your home.
                </p>
            </section>

            {/* Dairy Grid */}
            <motion.section className="max-w-6xl mx-auto w-full p-4 flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Dairy Products</h2>
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden animate-pulse"
                            >
                                <div className="w-full h-48 bg-gray-200"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 w-3/4"></div>
                                    <div className="h-3 bg-gray-200 w-full"></div>
                                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                                    <div className="flex justify-between items-center mt-4">
                                        <div className="h-6 bg-gray-200 w-16"></div>
                                        <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                ) : (

                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {beverageProducts.map((item) => (
                            <motion.div key={item._id} className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col"
                                variants={cardVariants}
                                whileHover={{
                                    y: -8,
                                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                                }}
                            >
                                <Link to={`/product/${encodeURIComponent(item.name)}`}>
                                    <img src={item.imgurl} alt={item.name} className="w-full h-48 object-cover"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                    />
                                </Link>
                                <div className="p-4 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-gray-500 text-sm mb-2">{item.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center mt-2">
                                        <span className="text-yellow-700 font-bold text-lg">${item.price}</span>
                                        <button onClick={() => handleAddToCart(item._id)} className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >Add to cart</button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
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