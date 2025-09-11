// src/components/Orders.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaShoppingBag, FaTrash, FaPlus, FaHome, FaClock, FaCheckCircle, FaReceipt } from 'react-icons/fa';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    setIsLoading(true);
    setTimeout(() => {
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      setOrders(orderHistory);
      setIsLoading(false);
    }, 500);
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear all order history?")) {
      localStorage.removeItem('orderHistory');
      setOrders([]);
    }
  };

  // Debug function to add sample orders
  const addSampleOrders = () => {
    const sampleOrders = [
      {
        orderId: "ORDER_123456789",
        txnToken: "MOCK_TXN_123456",
        amount: "99.99",
        items: [
          { name: "Organic Apples", price: "49.99", quantity: 1 },
          { name: "Fresh Milk", price: "25.00", quantity: 2 }
        ],
        timestamp: new Date().toISOString(),
        status: 'completed',
        isMock: true
      },
      {
        orderId: "ORDER_987654321",
        txnToken: "MOCK_TXN_654321",
        amount: "149.50",
        items: [
          { name: "Whole Wheat Bread", price: "35.50", quantity: 1 },
          { name: "Eggs (Dozen)", price: "60.00", quantity: 1 },
          { name: "Butter", price: "54.00", quantity: 1 }
        ],
        timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        status: 'completed',
        isMock: true
      }
    ];

    localStorage.setItem('orderHistory', JSON.stringify(sampleOrders));
    loadOrders();
  };

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
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="text-3xl"
            >
              📦
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
          </div>
          <div className="flex gap-3">
            {orders.length > 0 && (
              <motion.button
                onClick={clearHistory}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaTrash className="text-sm" />
                Clear History
              </motion.button>
            )}
            {orders.length === 0 && (
              <motion.button
                onClick={addSampleOrders}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 text-sm flex items-center gap-2 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <FaPlus className="text-sm" />
                Add Sample Orders
              </motion.button>
            )}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="flex items-center justify-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full"
              />
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              key="empty"
              className="bg-white p-12 rounded-2xl shadow-lg text-center"
              variants={cardVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="text-8xl mb-6"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                📦
              </motion.div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-3">No orders yet</h2>
              <p className="text-gray-600 mb-8 text-lg">Your order history will appear here after you make purchases.</p>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/"
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white px-8 py-4 rounded-xl hover:from-yellow-600 hover:to-yellow-700 inline-block font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                >
                  <FaHome />
                  Start Shopping
                </Link>
              </motion.div>
              <p className="text-sm text-gray-500 mt-6">
                Or click "Add Sample Orders" to see how the order history looks.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="orders"
              className="space-y-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                className="bg-white p-4 rounded-xl shadow-md"
                variants={itemVariants}
              >
                <p className="text-sm text-gray-600 flex items-center gap-2">
                  <FaReceipt />
                  Showing {orders.length} order{orders.length !== 1 ? 's' : ''}
                </p>
              </motion.div>

              {orders.map((order, index) => (
                <motion.div
                  key={order.orderId}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                          className="text-2xl"
                        >
                          🛒
                        </motion.div>
                        <h3 className="font-bold text-xl text-gray-800">Order #{order.orderId}</h3>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <FaClock />
                        <span>
                          {new Date(order.timestamp).toLocaleDateString()} at {new Date(order.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                    </div>
                    <div className="text-right mt-4 sm:mt-0">
                      <p className="text-2xl font-bold text-green-600 mb-2">₹{order.amount}</p>
                      <motion.span
                        className={`text-xs px-3 py-1 rounded-full font-medium ${order.isMock
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-green-100 text-green-800'
                          }`}
                        whileHover={{ scale: 1.05 }}
                      >
                        {order.isMock ? 'Mock Payment' : 'Completed'}
                      </motion.span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold mb-4 text-gray-800 flex items-center gap-2">
                      <FaShoppingBag />
                      Items ({order.items?.length || 0}):
                    </h4>
                    {order.items && order.items.length > 0 ? (
                      <div className="space-y-3">
                        {order.items.map((item, index) => (
                          <motion.div
                            key={index}
                            className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <span className="text-gray-700 font-medium">
                              {item.name || `Item ${index + 1}`}
                              {item.quantity > 1 && (
                                <span className="text-gray-500 ml-2">× {item.quantity}</span>
                              )}
                            </span>
                            <span className="text-gray-600 font-semibold">₹{item.price || '0.00'}</span>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm italic">No items information available</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}