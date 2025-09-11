import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaChevronRight } from 'react-icons/fa';

function Breadcrumb() {
    const location = useLocation();

    const getBreadcrumbItems = () => {
        const pathname = location.pathname;
        const segments = pathname.split('/').filter(segment => segment !== '');

        const breadcrumbMap = {
            'home': 'Home',
            'Fruits': 'Fruits',
            'vegetable': 'Vegetables',
            'dairy': 'Dairy',
            'bakery': 'Bakery',
            'snacks': 'Snacks',
            'beverage': 'Beverages',
            'cart': 'Shopping Cart',
            'checkout': 'Checkout',
            'orders': 'Order History',
            'dashboard': 'Dashboard',
            'order-success': 'Order Success',
            'product': 'Product Details'
        };

        const items = [];

        // Always add Home
        items.push({ name: 'Home', path: '/home', current: false });

        if (segments.length === 0) {
            return items;
        }

        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const name = breadcrumbMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
            const isLast = index === segments.length - 1;

            items.push({
                name,
                path: currentPath,
                current: isLast
            });
        });

        return items;
    };

    const breadcrumbItems = getBreadcrumbItems();

    if (breadcrumbItems.length <= 1) {
        return null; // Don't show breadcrumb on home page
    }

    return (
        <motion.nav
            className="bg-white border-b border-gray-200 px-4 py-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <div className="max-w-7xl mx-auto">
                <ol className="flex items-center space-x-2 text-sm">
                    {breadcrumbItems.map((item, index) => (
                        <li key={item.path} className="flex items-center">
                            {index > 0 && (
                                <FaChevronRight className="text-gray-400 mx-2" />
                            )}
                            {item.current ? (
                                <span className="text-gray-900 font-medium">
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="text-gray-500 hover:text-yellow-600 transition-colors duration-200 flex items-center gap-1"
                                >
                                    {index === 0 && <FaHome className="text-sm" />}
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </motion.nav>
    );
}

export default Breadcrumb;

