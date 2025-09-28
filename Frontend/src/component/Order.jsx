// src/components/Orders.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaTrash, FaHome, FaClock, FaCheckCircle, FaReceipt } from 'react-icons/fa';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Fixed: Properly fetch orders from backend
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not logged in");
        }

        // ✅ Fixed: Use correct API endpoint (/api/order/myorders)
        const res = await fetch("http://localhost:5000/api/order/myorders", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || `HTTP ${res.status}: Failed to fetch orders`);
        }

        const ordersData = await res.json();
        setOrders(ordersData);
        
      } catch (err) {
        console.error("Fetch orders error:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []); // ✅ Fixed: Added empty dependency array to prevent infinite re-renders

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200 } },
    hover: { scale: 1.02, transition: { type: "spring", stiffness: 300 } }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button 
              onClick={() => window.location.reload()} 
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again or login
            </button>
            <Link to="/" className="block w-full bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-b from-yellow-50 to-white p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex flex-col sm:flex-row justify-between items-center mb-8"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center gap-3 mb-4 sm:mb-0">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="text-3xl">📦</motion.div>
            <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div key="loading" className="flex items-center justify-center py-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full" />
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div key="empty" className="bg-white p-12 rounded-2xl shadow-lg text-center" variants={cardVariants} initial="hidden" animate="visible">
              <motion.div className="text-8xl mb-6" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>📦</motion.div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">No orders yet</h2>
              <p className="text-gray-600 mb-8 text-lg">Your order history will appear here after you make purchases.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 inline-block font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto">
                  <FaHome /> Start Shopping
                </Link>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div key="orders" className="space-y-6" variants={containerVariants} initial="hidden" animate="visible">
              <motion.div className="bg-white p-4 rounded-xl shadow-md" variants={itemVariants}>
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaReceipt /> Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                </p>
              </motion.div>

              {orders.map((order) => (
                <motion.div key={order._id} className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100" variants={cardVariants} whileHover="hover">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="text-2xl">🛒</motion.div>
                        <h3 className="font-bold text-xl text-gray-800">Order #{order._id?.slice(-8) || 'N/A'}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaClock />
                        <span>
                          {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : new Date(order.createdAt).toLocaleDateString()} at {' '}
                          {order.paidAt ? new Date(order.paidAt).toLocaleTimeString() : new Date(order.createdAt).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right mt-4 sm:mt-0">
                      <p className="text-2xl font-bold text-green-600 mb-2">₹{order.amount || '0.00'}</p>
                      <motion.span className="text-xs px-3 py-1 rounded-full font-medium bg-green-100 text-green-800" whileHover={{ scale: 1.05 }}>
                        {order.status || 'Completed'}
                      </motion.span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <FaShoppingBag /> Items ({order.items?.length || 0}):
                    </h4>
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <motion.div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                            <span className="text-gray-700 font-medium">
                              {item.name || item.title || `Item ${index + 1}`}
                              {item.quantity && item.quantity > 1 && <span className="text-gray-500 ml-2">× {item.quantity}</span>}
                            </span>
                            <span className="text-gray-600 font-semibold">₹{item.price || '0.00'}</span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No items information available</p>
                    )}
                  </div>

                  {/* ✅ Added PayPal transaction details if available */}
                  {order.paypal && (
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <h4 className="font-semibold mb-2 text-gray-800">Payment Details:</h4>
                      <div className="bg-blue-50 p-3 rounded-lg text-sm">
                        <p><strong>PayPal Order ID:</strong> {order.paypal.orderId}</p>
                        {order.paypal.paymentId && <p><strong>Payment ID:</strong> {order.paypal.paymentId}</p>}
                        <p><strong>Status:</strong> {order.paypal.status}</p>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}