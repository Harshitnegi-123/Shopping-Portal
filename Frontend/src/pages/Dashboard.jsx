import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaShoppingCart,
    FaTruck,
    FaDollarSign,
    FaUsers,
    FaBox,
    FaExclamationTriangle,
    FaEye,
    FaChartLine,
    FaRedo,
    FaCalendarAlt,
    FaClock
} from 'react-icons/fa';
import API from "../api"

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            const response = await API.get('/api/dashboard/stats', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.response?.data?.error || error.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [refreshKey]);

    const handleRefresh = () => {
        setRefreshKey(prev => prev + 1);
    };

    const navigate = useNavigate();

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 100 }
        }
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-purple-100 text-purple-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full mx-auto mb-4"
                    />
                    <p className="text-gray-600">Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center max-w-md mx-auto p-6">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <motion.button
                        onClick={handleRefresh}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <FaRedo />
                        Retry
                    </motion.button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <motion.div
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-yellow-600 rounded-full">
                                <FaChartLine className="text-white text-2xl" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-white">Kiranakart Dashboard</h1>
                                <p className="text-yellow-100">Real-time insights and analytics</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <motion.button
                                onClick={handleRefresh}
                                className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <FaRedo />
                                Refresh
                            </motion.button>
                            <span className="text-white font-medium">Admin</span>
                            <img
                                src="https://i.pravatar.cc/40"
                                alt="profile"
                                className="rounded-full w-10 h-10 border-2 border-white"
                            />
                        </div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {stats && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <motion.div
                                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                variants={cardVariants}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Orders Today</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.ordersToday}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 rounded-full">
                                        <FaShoppingCart className="text-yellow-600 text-xl" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                variants={cardVariants}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Active Deliveries</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.activeDeliveries}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <FaTruck className="text-blue-600 text-xl" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                variants={cardVariants}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Total Revenue</p>
                                        <p className="text-3xl font-bold text-gray-800">{formatCurrency(stats.totalRevenue)}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <FaDollarSign className="text-green-600 text-xl" />
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                className="bg-white p-6 rounded-xl shadow-lg border border-gray-100"
                                variants={cardVariants}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 font-medium">Total Customers</p>
                                        <p className="text-3xl font-bold text-gray-800">{stats.customers}</p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <FaUsers className="text-purple-600 text-xl" />
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Main Content */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Orders */}
                            <motion.section
                                className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2 border border-gray-100"
                                variants={cardVariants}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <FaBox className="text-yellow-600" />
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-200">
                                                <th className="py-3 text-left font-semibold text-gray-700">Order ID</th>
                                                <th className="py-3 text-left font-semibold text-gray-700">Customer</th>
                                                <th className="py-3 text-left font-semibold text-gray-700">Amount</th>
                                                <th className="py-3 text-left font-semibold text-gray-700">Status</th>
                                                <th className="py-3 text-left font-semibold text-gray-700">Date</th>
                                                <th className="py-3 text-left font-semibold text-gray-700">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {stats.recentOrders && stats.recentOrders.length > 0 ? (
                                                stats.recentOrders.map((order) => (
                                                    <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                        <td className="py-3 font-medium text-gray-800">#{order._id.slice(-6)}</td>
                                                        <td className="py-3 text-gray-600">{order.userId?.name || 'Unknown'}</td>
                                                        <td className="py-3 text-gray-600">{formatCurrency(order.amount)}</td>
                                                        <td className="py-3">
                                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-gray-600">{formatDate(order.createdAt)}</td>
                                                        <td className="py-3">
                                                            <button className="text-yellow-600 hover:text-yellow-700 font-medium flex items-center gap-1">
                                                                <FaEye className="text-sm" />
                                                                View
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="py-8 text-center text-gray-500">
                                                        No recent orders found
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.section>

                            {/* Sidebar */}
                            <motion.aside
                                className="flex flex-col gap-6"
                                variants={cardVariants}
                            >
                                {/* Inventory Alerts */}
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 bg-red-100 rounded-lg">
                                            <FaExclamationTriangle className="text-red-600" />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-800">Inventory Alerts</h3>
                                    </div>
                                    {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                                        <ul className="space-y-3">
                                            {stats.lowStockProducts.map((product) => (
                                                <li key={product._id} className="flex items-center gap-2 text-sm">
                                                    <div className={`w-2 h-2 rounded-full ${product.quantity === 0 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                                    <span className={`font-medium ${product.quantity === 0 ? 'text-red-600' : 'text-yellow-600'}`}>
                                                        {product.name} - {product.quantity === 0 ? 'Out of Stock' : `${product.quantity} left`}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-gray-500 text-sm">All products are well stocked!</p>
                                    )}
                                </div>

                                {/* Quick Stats */}
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm">Total Products</span>
                                            <span className="font-semibold text-gray-800">{stats.products}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm">Total Orders</span>
                                            <span className="font-semibold text-gray-800">{stats.totalOrders}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 text-sm">Avg Order Value</span>
                                            <span className="font-semibold text-gray-800">
                                                {stats.totalOrders > 0 ? formatCurrency(stats.totalRevenue / stats.totalOrders) : '₹0'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Actions */}
                                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                                            Add New Product
                                        </button>
                                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                                            View All Orders
                                        </button>
                                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors duration-200">
                                            Manage Inventory
                                        </button>
                                    </div>
                                </div>
                            </motion.aside>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}

export default Dashboard


