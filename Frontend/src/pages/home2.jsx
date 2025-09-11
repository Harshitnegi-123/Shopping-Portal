import React, { useState, useEffect } from "react";
import HeroText from "../component/HeroText";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../api";

const categories = [
    { name: "Fruits", icon: "🍎", link: "/Fruits" },
    { name: "Vegetables", icon: "🥦", link: "/vegetable" },
    { name: "Dairy", icon: "🥛", link: "/dairy" },
    { name: "Bakery", icon: "🍞", link: "/bakery" },
    { name: "Snacks", icon: "🍪", link: "/snacks" },
    { name: "Beverages", icon: "🥤", link: "/beverage" },
];

const offers = [
    {
        title: "20% Off on Fresh Fruits",
        desc: "Get a healthy start! Limited time offer on all fresh fruits.",
        color: "bg-yellow-200",
    },
    {
        title: "Buy 1 Get 1 Free: Dairy",
        desc: "Double the goodness on select dairy products.",
        color: "bg-yellow-100",
    },
    {
        title: "Free Delivery Over $25",
        desc: "No delivery charges on orders above $25.",
        color: "bg-yellow-300",
    },
];

const features = [
    {
        icon: "🚚",
        title: "Superfast Delivery",
        desc: "Groceries delivered to your door in under 30 minutes!",
    },
    {
        icon: "🥗",
        title: "Freshness Guaranteed",
        desc: "We source only the freshest produce and products.",
    },
    {
        icon: "💳",
        title: "Easy Payments",
        desc: "Multiple payment options for your convenience.",
    },
];

const testimonials = [
    {
        name: "Priya S.",
        review: "GrocerEase is a lifesaver! Super quick delivery and everything is always fresh.",
        avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    },
    {
        name: "Abhinav M.",
        review: "Great prices, great service. I love the offers and the easy checkout!",
        avatar: "https://randomuser.me/api/portraits/men/65.jpg",
    },
];

const defaultProducts = [
    {
        id: 1,
        name: "Fresh Apples",
        price: 2.99,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        description: "Crisp and juicy apples, perfect for snacking."
    },
    {
        id: 2,
        name: "Organic Bananas",
        price: 1.49,
        unit: "kg",
        image: "https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80",
        description: "Sweet, organic bananas for your daily nutrition."
    },
    {
        id: 3,
        name: "Fresh Milk",
        price: 0.99,
        unit: "L",
        image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        description: "Locally sourced, farm-fresh milk delivered daily."
    }
];

// ProductCard Component moved outside
function ProductCard({ product }) {
    const [isAdding, setIsAdding] = useState(false);

    const handleAddToCart = async () => {
        try {
            setIsAdding(true);
            // Call API to add to cart
            await api.addToCart(product.id);
            // Show success animation
            setTimeout(() => setIsAdding(false), 1000);
        } catch (error) {
            console.error("Error adding to cart:", error);
            setIsAdding(false);
        }
    };

    return (
        <motion.div
            className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col h-full"
            variants={itemVariants}
            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
        >
            <div className="relative overflow-hidden h-48">
                <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                />
                <div className="absolute top-2 right-2">
                    <motion.button
                        className="bg-white p-2 rounded-full shadow-md text-yellow-500"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                    </motion.button>
                </div>
            </div>
            <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{product.description}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-yellow-700 font-bold text-lg">${product.price}/{product.unit}</span>
                    <motion.button
                        className={`px-4 py-2 text-sm rounded-full ${isAdding ? 'bg-green-500 text-white' : 'bg-yellow-400 text-yellow-900'} font-semibold hover:bg-yellow-500 transition flex items-center gap-1`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleAddToCart}
                        disabled={isAdding}
                    >
                        {isAdding ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Added
                            </>
                        ) : (
                            <>
                                Add
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                </svg>
                            </>
                        )}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
}

// FeaturedProductsCarousel Component moved outside
function FeaturedProductsCarousel({ products }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsToShow, setItemsToShow] = useState(3);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 640) {
                setItemsToShow(1);
            } else if (window.innerWidth < 1024) {
                setItemsToShow(2);
            } else {
                setItemsToShow(3);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex + itemsToShow >= products.length ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? Math.max(0, products.length - itemsToShow) : prevIndex - 1
        );
    };

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000);

        return () => clearInterval(interval);
    }, [currentIndex]);

    return (
        <div className="relative">
            <motion.div
                className="overflow-hidden"
                variants={containerVariants}
            >
                <motion.div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                        width: `${(products.length / itemsToShow) * 100}%`
                    }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="px-3"
                            style={{ width: `${100 / products.length * itemsToShow}%` }}
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </motion.div>
            </motion.div>

            <motion.button
                className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 bg-white rounded-full p-2 shadow-md text-yellow-500 z-10"
                onClick={prevSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variants={itemVariants}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </motion.button>

            <motion.button
                className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 bg-white rounded-full p-2 shadow-md text-yellow-500 z-10"
                onClick={nextSlide}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variants={itemVariants}
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </motion.button>

            <div className="flex justify-center mt-6 space-x-2">
                {Array.from({ length: Math.ceil(products.length / itemsToShow) }).map((_, index) => (
                    <motion.button
                        key={index}
                        className={`w-2 h-2 rounded-full ${currentIndex === index * itemsToShow ? 'bg-yellow-500' : 'bg-gray-300'}`}
                        onClick={() => setCurrentIndex(index * itemsToShow)}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                    />
                ))}
            </div>
        </div>
    );
}

// Animation variants (moved outside to make them accessible to components)
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

export default function Home() {
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [cartItem, setCartItem] = useState([]);
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/api/products?limit=6');
                if (response.data && response.data.products) {
                    setProducts(response.data.products);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, []);

    const getTotalItem = () => {
        return cartItem.reduce((total, item) => total + item.quantity, 0)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-white">
            {/* Navbar will be rendered from App.jsx */}
            <div className="w-full">
                {/* Navbar will be rendered from App.jsx */}
            </div>

            {/* Hero Section with Animations */}
            <motion.section
                className="relative bg-gradient-to-br from-yellow-50 to-yellow-100 py-16 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center relative z-10">
                    <motion.div
                        className="md:w-1/2 mb-8 md:mb-0"
                        initial={{ x: -100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <HeroText text="Fresh Groceries Delivered to Your Door" />
                        </motion.div>
                        <motion.p
                            className="text-lg text-gray-700 mb-8 max-w-md"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            Shop from our wide selection of fresh produce, dairy, meats, and pantry essentials with fast delivery and premium quality.
                        </motion.p>
                        <motion.button
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition flex items-center gap-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/products')}
                        >
                            Shop Now
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </motion.button>
                    </motion.div>
                    <motion.div
                        className="md:w-1/2"
                        initial={{ x: 100, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                    >
                        <motion.img
                            src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80"
                            alt="Grocery Delivery"
                            className="rounded-2xl shadow-2xl"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.3 }}
                        />
                    </motion.div>
                </div>

                {/* Decorative elements */}
                <motion.div
                    className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-300 rounded-full opacity-20"
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 15, 0]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
                <motion.div
                    className="absolute -bottom-32 -left-32 w-96 h-96 bg-yellow-400 rounded-full opacity-10"
                    animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, -10, 0]
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                />
            </motion.section>

            {/* Offers Section with Animations */}
            <motion.section
                className="max-w-6xl mx-auto w-full p-4"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2
                    className="text-xl font-bold text-gray-800 mb-4 text-center"
                    variants={itemVariants}
                >
                    Special Offers
                </motion.h2>
                <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    variants={containerVariants}
                >
                    {offers.map((offer, idx) => (
                        <motion.div
                            key={idx}
                            className={`rounded-xl shadow px-6 py-4 min-w-[220px] ${offer.color} flex flex-col items-start`}
                            variants={itemVariants}
                            whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                        >
                            <div className="font-semibold text-lg text-yellow-900 mb-1">{offer.title}</div>
                            <div className="text-gray-700 text-sm">{offer.desc}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.section>

            {/* Why Choose Us Section with Animations */}
            <motion.section
                className="bg-gray-50 py-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-2xl font-bold text-gray-800 mb-8 text-center"
                        variants={itemVariants}
                    >
                        Why Choose Us
                    </motion.h2>
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                        variants={containerVariants}
                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center"
                                variants={itemVariants}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                            >
                                <motion.div
                                    className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600"
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <span className="text-2xl">{feature.icon}</span>
                                </motion.div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600">{feature.desc}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.section>

            {/* Categories Section with Animations */}
            <motion.section
                className="max-w-6xl mx-auto w-full p-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-8 text-center"
                    variants={itemVariants}
                >
                    Shop by Category
                </motion.h2>
                <motion.div
                    className="flex flex-wrap gap-6 justify-center"
                    variants={containerVariants}
                >
                    {categories.map((cat) => (
                        cat.link ? (
                            <motion.div
                                key={cat.name}
                                variants={itemVariants}
                                whileHover={{
                                    y: -5,
                                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                                    backgroundColor: "#FFFBEB"
                                }}
                            >
                                <Link
                                    to={cat.link}
                                    className="flex flex-col items-center bg-white rounded-xl shadow px-6 py-4 transition"
                                    style={{ textDecoration: 'none' }}
                                >
                                    <motion.span
                                        className="text-3xl mb-2"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {cat.icon}
                                    </motion.span>
                                    <span className="font-medium text-gray-700">{cat.name}</span>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.button
                                key={cat.name}
                                className="flex flex-col items-center bg-white py-4 px-6 rounded-xl shadow transition"
                                disabled
                                variants={itemVariants}
                            >
                                <span className="text-3xl mb-2">{cat.icon}</span>
                                <span className="font-medium text-gray-600">{cat.name}</span>
                            </motion.button>
                        )
                    ))}
                </motion.div>
            </motion.section>

            {/* Product grid with animations */}
            <motion.section
                className="p-6 max-w-6xl m-auto w-full"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2
                    className="text-2xl font-bold text-gray-800 mb-8 text-center"
                    variants={itemVariants}
                >
                    Popular Groceries
                </motion.h2>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
                    variants={containerVariants}
                >
                    {products.length > 0 ? products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    )) : (
                        <>
                            <ProductCard
                                product={defaultProducts[0]}
                            />
                            <ProductCard
                                product={defaultProducts[1]}
                            />
                            <ProductCard
                                product={defaultProducts[2]}
                            />
                        </>
                    )}
                </motion.div>
            </motion.section>

            {/* Featured Products Carousel */}
            <motion.section
                className="py-12 bg-white"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        className="text-2xl font-bold text-gray-800 mb-8 text-center"
                        variants={itemVariants}
                    >
                        Featured Products
                    </motion.h2>

                    <FeaturedProductsCarousel products={products.length > 0 ? products : [
                        {
                            id: 4,
                            name: "Organic Avocados",
                            price: 3.99,
                            unit: "each",
                            image: "https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?auto=format&fit=crop&w=400&q=80",
                            description: "Perfectly ripe, ready-to-eat avocados."
                        },
                        {
                            id: 5,
                            name: "Fresh Strawberries",
                            price: 4.99,
                            unit: "box",
                            image: "https://images.unsplash.com/photo-1518635017498-87f514b751ba?auto=format&fit=crop&w=400&q=80",
                            description: "Sweet and juicy strawberries, freshly picked."
                        },
                        {
                            id: 6,
                            name: "Whole Grain Bread",
                            price: 3.49,
                            unit: "loaf",
                            image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80",
                            description: "Freshly baked whole grain bread."
                        },
                        {
                            id: 7,
                            name: "Free Range Eggs",
                            price: 5.99,
                            unit: "dozen",
                            image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d9?auto=format&fit=crop&w=400&q=80",
                            description: "Farm fresh free-range eggs."
                        },
                        {
                            id: 8,
                            name: "Organic Honey",
                            price: 8.99,
                            unit: "jar",
                            image: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?auto=format&fit=crop&w=400&q=80",
                            description: "Pure, raw organic honey from local beekeepers."
                        }
                    ]} />
                </div>
            </motion.section>

            {/* Testimonials Section */}
            <section className="max-w-4xl mx-auto w-full p-4 mt-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">What Our Customers Say</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {testimonials.map((t, idx) => (
                        <div key={idx} className="bg-white rounded-xl shadow px-6 py-6 flex flex-col items-center w-80">
                            <img src={t.avatar} alt={t.name} className="w-16 h-16 rounded-full mb-3 object-cover" />
                            <div className="italic text-gray-700 mb-2 text-center">"{t.review}"</div>
                            <div className="font-semibold text-yellow-700">{t.name}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-gray-400 text-sm border-t border-yellow-100">
                &copy; 2025 KiranaKart. Made by Harshit Negi.
            </footer>
        </div>
    );
}