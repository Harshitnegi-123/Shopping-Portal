import { motion, AnimatePresence } from "framer-motion"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import {
    FaHome,
    FaShoppingCart,
    FaUser,
    FaReceipt,
    FaAppleAlt,
    FaCarrot,
    FaMugHot,
    FaBreadSlice,
    FaCookieBite,
    FaWineGlassAlt,
    FaChevronDown,
    FaSignOutAlt,
    FaHistory,
    FaHeart,
    FaCog,
    FaBars,
    FaTimes
} from 'react-icons/fa'

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const categories = [
        { name: "Fruits", icon: FaAppleAlt, path: "/Fruits" },
        { name: "Vegetables", icon: FaCarrot, path: "/vegetable" },
        { name: "Dairy", icon: FaMugHot, path: "/dairy" },
        { name: "Bakery", icon: FaBreadSlice, path: "/bakery" },
        { name: "Snacks", icon: FaCookieBite, path: "/snacks" },
        { name: "Beverages", icon: FaWineGlassAlt, path: "/beverage" },
    ];

    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-300 to-yellow-400 shadow-lg sticky top-0 z-50"
        >
            <nav className="flex items-center justify-between py-4 px-4 mx-auto max-w-7xl">
                {/* Logo */}
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="text-2xl font-black tracking-wider text-white"
                >
                    <Link to="/home" className="flex items-center gap-2">
                        <span className="text-yellow-900">Kirana</span>
                        <span className="text-white">Kart</span>
                    </Link>
                </motion.div>

                {/* Desktop Navigation */}
                <div className="hidden lg:flex items-center space-x-4">
                    {/* Home */}
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                            to="/home"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive('/home')
                                ? 'bg-yellow-600 text-white shadow-md'
                                : 'text-white hover:bg-yellow-600 hover:shadow-md'
                                }`}
                        >
                            <FaHome className="text-lg" />
                            <span>Home</span>
                        </Link>
                    </motion.div>

                    {/* Categories Dropdown */}
                    <div className="relative">
                        <motion.button
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:bg-yellow-600 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span>Categories</span>
                            <motion.div
                                animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaChevronDown />
                            </motion.div>
                        </motion.button>

                        <AnimatePresence>
                            {isCategoriesOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                                >
                                    <div className="p-2">
                                        {categories.map((category, index) => (
                                            <motion.div
                                                key={category.name}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Link
                                                    to={category.path}
                                                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200"
                                                    onClick={() => setIsCategoriesOpen(false)}
                                                >
                                                    <category.icon className="text-lg" />
                                                    <span className="font-medium">{category.name}</span>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Cart */}
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                            to="/cart"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive('/cart')
                                ? 'bg-yellow-600 text-white shadow-md'
                                : 'text-white hover:bg-yellow-600 hover:shadow-md'
                                }`}
                        >
                            <FaShoppingCart className="text-lg" />
                            <span>Cart</span>
                        </Link>
                    </motion.div>

                    {/* Orders */}
                    <motion.div whileHover={{ scale: 1.05 }}>
                        <Link
                            to="/orders"
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${isActive('/orders')
                                ? 'bg-yellow-600 text-white shadow-md'
                                : 'text-white hover:bg-yellow-600 hover:shadow-md'
                                }`}
                        >
                            <FaReceipt className="text-lg" />
                            <span>Orders</span>
                        </Link>
                    </motion.div>

                    {/* User Menu */}
                    <div className="relative">
                        <motion.button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium hover:bg-yellow-600 transition-all duration-300"
                            whileHover={{ scale: 1.05 }}
                        >
                            <FaUser className="text-lg" />
                            <span>{user.name || 'Account'}</span>
                            <motion.div
                                animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <FaChevronDown />
                            </motion.div>
                        </motion.button>

                        <AnimatePresence>
                            {isUserMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
                                >
                                    <div className="p-2">
                                        <Link
                                            to="/orders"
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-yellow-50 hover:text-yellow-700 transition-all duration-200"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <FaHistory className="text-lg" />
                                            <span className="font-medium">Order History</span>
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                handleLogout();
                                            }}
                                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full text-left transition-all duration-200"
                                        >
                                            <FaSignOutAlt className="text-lg" />
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <motion.button
                    className="lg:hidden text-white p-2"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                >
                    {isMenuOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
                </motion.button>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="lg:hidden bg-yellow-500 border-t border-yellow-600"
                    >
                        <div className="px-4 py-4 space-y-3">
                            <Link
                                to="/home"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-yellow-600 transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FaHome className="text-lg" />
                                <span className="font-medium">Home</span>
                            </Link>

                            <Link
                                to="/cart"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-yellow-600 transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FaShoppingCart className="text-lg" />
                                <span className="font-medium">Cart</span>
                            </Link>

                            <Link
                                to="/orders"
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-yellow-600 transition-all duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <FaReceipt className="text-lg" />
                                <span className="font-medium">Orders</span>
                            </Link>

                            <button
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    handleLogout();
                                }}
                                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-200 hover:bg-red-600 transition-all duration-200 w-full text-left"
                            >
                                <FaSignOutAlt className="text-lg" />
                                <span className="font-medium">Logout</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Navbar