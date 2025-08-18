import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import api from "../api";
import { div, header, img } from "framer-motion/client";

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

                const res = await axios.get("http://localhost:5000/api/cart", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.data && res.data.items) {
                    setCartItems(res.data.items);
                    // Calculate total price
                    const total = res.data.items.reduce((sum, item) => {
                        return sum + (item.productId.price * item.quantity);
                    }, 0);
                    setTotalPrice(total);
                } else {
                    setCartItems([]);
                }

            } catch (error) {
                console.error(error);
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

    return (
        <div className="min-h-screen flex flex-col ">
            {/* Navbar */}
            <nav className="bg-yellow-300 flex px-6 py-4 justify-between items-center shadow">
                <div className="font-bold text-2xl text-gray-800">KiranaKart</div>
                <div className="flex gap-6 items-center text-base font-medium ">
                    <Link to="/home" className="text-gray-700 hover:text-yellow-700 transition">Home</Link>
                    <Link to="/" className="text-gray-700 hover:text-yellow-700 transition">Whishlist</Link>
                </div>
            </nav>
            {/* Cart Content */}
            <div className="max-w-6xl mx-auto w-full p-6 flex-1 ">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="rounded-full h-12 w-12 border-t-2"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                ) : cartItems.length === 0 ? (
                    <div>
                        <div className="text-5xl mb-4">🛒</div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your cart is empty</h2>
                        <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet.</p>
                        <Link to="/home" className="bg-yellow-400 text-yellow-800 rounded-full font-semibold py-3 px-6 transition hover:bg-yellow-500">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="lg:w-1/2">
                            <div className="bg-white rounded-xl shadow overflow-hidden">
                                <div className="divide-y divide-gray-200">
                                    {cartItems.map((item) => (
                                        <div className="p-6 flex flex-col sm:flex-row gap-4">
                                            {/* product image */}
                                            <div className="sm:w-24 h-24 bg-gray-200 rounded-lg overflow-hidden">
                                                {item.productId.imgurl ? (
                                                    <img src={item.productId.imgurl} alt={item.productId.name}
                                                        className=" object-cover h-full w-full" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-400">no image</div>
                                                )}
                                            </div>
                                            {/* product details */}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-lg text-gray-800">{item.productId.name}</h3>
                                                <p className="text-gray-600 text-sm mb-2">{item.productId.description}</p>
                                                <div className="flex justify-between items-center">
                                                    <div className="text-yellow-700 font-bold">
                                                        ${item.productId.price ? item.productId.price.toFixed(2) : 0}
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        {/* Quantity Controls */}
                                                        <div className="flex items-center gap-2">
                                                            <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-yellow-100 text-gray-600"
                                                                onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                                                            >-</button>
                                                            <span className="w-8 text-center">{item.quantity}</span>
                                                            <button className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-full hover:bg-yellow-100 text-gray-600"
                                                                onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                                                            >+</button>
                                                        </div>
                                                        {/* Remove button */}
                                                        <button className="text-red-500 hover:text-red-700 self-start sm:self-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"
                                                            onClick={() => handleRemoveItem(item._id)}>
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        {/* Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-xl shadow p-6 top-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h3>
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>${totalPrice.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>Free</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax</span>
                                        <span>${(totalPrice * 0.05).toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex justify-between font-bold text-lg">
                                            <span>Total</span>
                                            <span className="text-yellow-700">${(totalPrice + (totalPrice * 0.05)).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full bg-yellow-400 text-yellow-800 rounded-full font-semibold py-3 px-6 transition hover:bg-yellow-500">
                                    Proceed to Checkout
                                </button>
                                <div className="mt-4">
                                    <Link to="/home" className="text-center block text-yellow-600 hover:text-yellow-700">
                                        ← Continue Shopping
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                )
                }
            </div>
        </div>
    );
}

export default Cart;