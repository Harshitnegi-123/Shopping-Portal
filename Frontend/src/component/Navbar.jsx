import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import { FaHome, FaShoppingCart } from 'react-icons/fa'

function Navbar() {
    const navigate = useNavigate();
    
    const goToHome = () => {
        navigate('/');
    };
    
    const goToCart = () => {
        navigate('/cart');
    };
    
    return (
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-lg"
        >
            <nav className="flex flex-col sm:flex-row items-center justify-between py-6 px-4 mx-auto max-w-7xl">
                <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="text-3xl font-black mb-4 sm:mb-0 tracking-wider text-white">
                    <Link to="/" className="flex items-center gap-2">
                        <span className="text-yellow-900">Shopping</span>
                        <span className="text-white">Portal</span>
                    </Link>
                </motion.div>
                
                <div className="flex items-center space-x-6">
                    <motion.div whileHover={{ scale: 1.1 }}>
                        <button 
                            onClick={goToHome}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <FaHome className="text-xl" />
                            <span>Home</span>
                        </button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.1 }}>
                        <button 
                            onClick={goToCart}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
                        >
                            <FaShoppingCart className="text-xl" />
                            <span>Cart</span>
                        </button>
                    </motion.div>
                </div>
            </nav>
        </motion.div>
    )
}

export default Navbar