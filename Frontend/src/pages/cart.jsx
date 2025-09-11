import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingCart, FaTrash, FaArrowLeft, FaPlus, FaMinus, FaCreditCard, FaTruck, FaReceipt } from 'react-icons/fa';
import api from "../api";

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setloading] = useState(true)
    const [error, setError] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    navigate("/"); // token nahi to login page
                    return;
                }

                const res = await api.get("/api/cart", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.items && res.data.items.length > 0) {
                    // Filter out items with missing productId or price
                    const validItems = res.data.items.filter(item =>
                        item.productId && item.productId.price !== undefined && item.productId.price !== null
                    );

                    setCartItems(validItems);

                    // Calculate total price safely
                    const total = validItems.reduce((sum, item) => {
                        return sum + ((item.productId.price || 0) * item.quantity);
                    }, 0);
                    setTotalPrice(total);
                } else {
                    setCartItems([]);
                    setTotalPrice(0);
                }

            } catch (error) {
                console.error("Error fetching cart:", error);
                setError("Failed to load cart items. Please try again.");
                if (error.response?.status === 401) {
                    navigate("/"); // unauthorized to login bhejo
                }
            } finally {
                setloading(false)
            }
        };

        fetchCart();
    }, [navigate]);

    const handleUpdateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            // Update locally first for responsive UI
            const updatedItems = cartItems.map(item => {
                if (item._id === itemId) {
                    return { ...item, quantity: newQuantity }
                }
                return item
            })
            setCartItems(updatedItems)

            // Recalculate total
            const updatedTotal = updatedItems.reduce((sum, item) => sum + (item.productId.price * item.quantity), 0);
            setTotalPrice(updatedTotal)

            // Then update on server
            const token = localStorage.getItem('token')
            await api.put(`/api/cart/update/${itemId}`, {
                quantity: newQuantity
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
            )
        } catch (error) {
            console.error('Error updating quantity:', error);
            setError('Failed to update quantity. Please try again.');

        }
    }

    const handleRemoveItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token')
            await api.delete(`/api/cart/delete/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Update cart after deletion
            setCartItems(cartItems.filter(item => item._id !== itemId))

            // Recalculate total
            const updatedTotal = cartItems
                .filter(item => item._id !== itemId)
                .reduce((sum, item) => sum + (item.productId.price * item.quantity), 0)
            setTotalPrice(updatedTotal)
        } catch (error) {
            console.error('Error removing item:', error);
            setError('Failed to remove item. Please try again.');
        }

    }

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const cardVariants = {
        hidden: { scale: 0.95, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200 }
        },
        hover: {
            scale: 1.02,
            transition: { type: "spring", stiffness: 300 }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    const emptyCartVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <motion.div
            className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            {/* Import Navbar component instead of defining it here */}
            <div className="w-full">
                {/* Navbar will be rendered from App.jsx */}
            </div>

            {/* Cart Content */}
            <div className="max-w-6xl mx-auto w-full p-6 flex-1">
                <motion.div
                    className="mb-8"
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl"
                        >
                            🛒
                        </motion.div>
                        <h1 className="text-4xl font-bold text-gray-800">Your Shopping Cart</h1>
                    </div>
                    <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
                </motion.div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            className="flex justify-center items-center h-64"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="rounded-full h-12 w-12 border-4 border-yellow-500 border-t-transparent"
                            />
                        </motion.div>
                    ) : error ? (
                        <motion.div
                            key="error"
                            className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl relative"
                            role="alert"
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <span className="block sm:inline font-medium">{error}</span>
                        </motion.div>
                    ) : cartItems.length === 0 ? (
                        <motion.div
                            key="empty"
                            className="text-center py-16"
                            variants={emptyCartVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className="text-8xl mb-6"
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                🛒
                            </motion.div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8 text-lg">Looks like you haven't added any items to your cart yet.</p>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/home"
                                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold py-4 px-8 transition-all duration-300 shadow-lg hover:shadow-xl inline-flex items-center gap-2"
                                >
                                    <FaArrowLeft />
                                    Continue Shopping
                                </Link>
                            </motion.div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="cart-content"
                            className="flex flex-col lg:flex-row gap-8"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {/* Cart Items */}
                            <motion.div
                                className="lg:w-2/3"
                                variants={itemVariants}
                            >
                                <motion.div
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <div className="p-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-b border-gray-200">
                                        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                                            <FaShoppingCart className="text-yellow-600" />
                                            Cart Items ({cartItems.length})
                                        </h2>
                                    </div>
                                    <div className="divide-y divide-gray-200">
                                        {cartItems.map((item, index) => (
                                            <motion.div
                                                key={item._id}
                                                className="p-6 flex flex-col sm:flex-row gap-4 hover:bg-gray-50 transition-colors duration-200"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                            >
                                                {/* product image */}
                                                <motion.div
                                                    className="sm:w-24 h-24 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0"
                                                    whileHover={{ scale: 1.05 }}
                                                    transition={{ type: "spring", stiffness: 300 }}
                                                >
                                                    {item.productId.imgurl ? (
                                                        <img
                                                            src={item.productId.imgurl}
                                                            alt={item.productId.name}
                                                            className="object-cover h-full w-full"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <FaReceipt className="text-2xl" />
                                                        </div>
                                                    )}
                                                </motion.div>

                                                {/* product details */}
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-800 mb-2">{item.productId.name}</h3>
                                                    <p className="text-gray-600 text-sm mb-4">{item.productId.description}</p>
                                                    <div className="flex justify-between items-center">
                                                        <div className="text-2xl font-bold text-yellow-700">
                                                            ₹{Number(item.productId.price || 0).toFixed(2)}
                                                        </div>

                                                        <div className="flex items-center gap-4">
                                                            {/* Quantity Controls */}
                                                            <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                                                                <motion.button
                                                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-yellow-100 text-gray-600 shadow-sm"
                                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                                    variants={buttonVariants}
                                                                    whileHover="hover"
                                                                    whileTap="tap"
                                                                >
                                                                    <FaMinus className="text-xs" />
                                                                </motion.button>
                                                                <span className="w-8 text-center font-semibold">{item.quantity}</span>
                                                                <motion.button
                                                                    className="w-8 h-8 flex items-center justify-center bg-white rounded-full hover:bg-yellow-100 text-gray-600 shadow-sm"
                                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                                    variants={buttonVariants}
                                                                    whileHover="hover"
                                                                    whileTap="tap"
                                                                >
                                                                    <FaPlus className="text-xs" />
                                                                </motion.button>
                                                            </div>

                                                            {/* Remove button */}
                                                            <motion.button
                                                                className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors duration-200"
                                                                onClick={() => handleRemoveItem(item._id)}
                                                                variants={buttonVariants}
                                                                whileHover="hover"
                                                                whileTap="tap"
                                                            >
                                                                <FaTrash className="h-5 w-5" />
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Order Summary */}
                            <motion.div
                                className="lg:w-1/3"
                                variants={itemVariants}
                            >
                                <motion.div
                                    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6"
                                    variants={cardVariants}
                                    whileHover="hover"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-3 bg-yellow-100 rounded-full">
                                            <FaCreditCard className="text-yellow-600 text-xl" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800">Order Summary</h3>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <span className="font-medium text-gray-700">Subtotal</span>
                                            <span className="font-semibold">₹{totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <span className="font-medium text-gray-700 flex items-center gap-2">
                                                <FaTruck className="text-green-600" />
                                                Shipping
                                            </span>
                                            <span className="text-green-600 font-semibold">Free</span>
                                        </div>
                                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                                            <span className="font-medium text-gray-700">Tax (5%)</span>
                                            <span className="font-semibold">₹{(totalPrice * 0.05).toFixed(2)}</span>
                                        </div>
                                        <div className="border-t-2 border-gray-200 pt-4">
                                            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                                                <span className="font-bold text-xl">Total</span>
                                                <span className="text-2xl font-bold text-yellow-700">₹{(totalPrice + (totalPrice * 0.05)).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={() => navigate('/checkout', {
                                            state: {
                                                cart: {
                                                    items: cartItems,
                                                    total: totalPrice
                                                }
                                            }
                                        })}
                                        className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-xl font-semibold py-4 px-6 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-lg"
                                        variants={buttonVariants}
                                        whileHover="hover"
                                        whileTap="tap"
                                    >
                                        <FaCreditCard />
                                        Proceed to Checkout
                                    </motion.button>

                                    <motion.div
                                        className="mt-4"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <Link
                                            to="/home"
                                            className="text-center block text-yellow-600 hover:text-yellow-700 font-medium flex items-center justify-center gap-2 transition-colors duration-300"
                                        >
                                            <FaArrowLeft />
                                            Continue Shopping
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

export default Cart;