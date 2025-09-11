import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    FaHome,
    FaShoppingCart,
    FaReceipt,
    FaUser,
    FaAppleAlt,
    FaCarrot,
    FaMugHot,
    FaBreadSlice,
    FaCookieBite,
    FaWineGlassAlt,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaHeart,
    FaArrowUp
} from 'react-icons/fa';

function Footer() {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const categories = [
        { name: "Fruits", icon: FaAppleAlt, path: "/Fruits" },
        { name: "Vegetables", icon: FaCarrot, path: "/vegetable" },
        { name: "Dairy", icon: FaMugHot, path: "/dairy" },
        { name: "Bakery", icon: FaBreadSlice, path: "/bakery" },
        { name: "Snacks", icon: FaCookieBite, path: "/snacks" },
        { name: "Beverages", icon: FaWineGlassAlt, path: "/beverage" },
    ];

    const quickLinks = [
        { name: "Home", path: "/home", icon: FaHome },
        { name: "Cart", path: "/cart", icon: FaShoppingCart },
        { name: "Orders", path: "/orders", icon: FaReceipt },
        { name: "Dashboard", path: "/dashboard", icon: FaUser },
    ];

    const socialLinks = [
        { name: "Facebook", icon: FaFacebook, url: "#", color: "hover:text-blue-600" },
        { name: "Twitter", icon: FaTwitter, url: "#", color: "hover:text-blue-400" },
        { name: "Instagram", icon: FaInstagram, url: "#", color: "hover:text-pink-600" },
        { name: "LinkedIn", icon: FaLinkedin, url: "#", color: "hover:text-blue-700" },
    ];

    return (
        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-black tracking-wider">
                                <span className="text-yellow-400">Kirana</span>
                                <span className="text-white">Kart</span>
                            </span>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">
                            Your one-stop destination for fresh groceries and quality products.
                            We deliver happiness to your doorstep with the best prices and fastest delivery.
                        </p>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <motion.a
                                    key={social.name}
                                    href={social.url}
                                    className={`text-gray-400 ${social.color} transition-colors duration-300 text-xl`}
                                    whileHover={{ scale: 1.2 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <social.icon />
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>

                    {/* Quick Links */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-yellow-400">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm"
                                    >
                                        <link.icon className="text-sm" />
                                        <span>{link.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Categories */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-yellow-400">Categories</h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.name}>
                                    <Link
                                        to={category.path}
                                        className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors duration-300 text-sm"
                                    >
                                        <category.icon className="text-sm" />
                                        <span>{category.name}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="space-y-4"
                    >
                        <h3 className="text-lg font-semibold text-yellow-400">Contact Us</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-gray-300 text-sm">
                                <FaPhone className="text-yellow-400" />
                                <span>+91 9205800437</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-300 text-sm">
                                <FaEnvelope className="text-yellow-400" />
                                <span>harshunegi14@gmail.com</span>
                            </div>
                            <div className="flex items-start gap-3 text-gray-300 text-sm">
                                <FaMapMarkerAlt className="text-yellow-400 mt-1 flex-shrink-0" />
                                <span>123 Shopping Street, Grocery City, GC 12345</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Bottom Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center"
                >
                    <div className="text-gray-400 text-sm text-center md:text-left">
                        <p>
                            © 2025 Kiranakart. Made with <FaHeart className="inline text-red-500" /> for our customers.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 mt-4 md:mt-0">
                        <Link
                            to="/home"
                            className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            to="/home"
                            className="text-gray-400 hover:text-yellow-400 transition-colors duration-300 text-sm"
                        >
                            Terms of Service
                        </Link>
                        <motion.button
                            onClick={scrollToTop}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white p-2 rounded-full transition-colors duration-300"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <FaArrowUp />
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        </footer>
    );
}

export default Footer;
