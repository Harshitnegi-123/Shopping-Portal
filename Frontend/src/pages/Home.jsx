import React from "react";
import { motion, stagger } from "framer-motion";
import HeroText from "../component/HeroText";
import { div } from "framer-motion/client";
import { Link } from "react-router-dom";

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

export default function Home() {

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
            // spring: ek natural bounce effect deta hai(jaise spring ki tarah slide ho ke aa raha ho).

            //     stiffness: jitna zyada stiffness utna tight/ bouncy motion.
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-yellow-50 to-white">
            {/* Navbar will be rendered from App.jsx */}
            <div className="w-full">
                {/* Navbar will be rendered from App.jsx */}
            </div>
            {/* Hero Section with Animations */}
            <motion.section
                className="bg-gradient-to-b from-yellow-50 to bg-yellow-100 py-16 overflow-hidden relative z-10 "
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}

            >
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
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
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-8 rounded-full shadow-LG transition flex items-center gap-2"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.7 }}
                            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgha(0,0,0,0.01),0 10px 10px -5px rgb(0,0,0,0.04)" }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => Navigate('')}
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
                        />

                    </motion.div>
                </div>
                {/* Decorative elements */}
                <motion.div
                    className="bg-yellow-300 rounded-full w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 opacity-20 absolute -top-24 -right-24"
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
                    className="absolute bg-yellow-400 rounded-full opacity-10 w-64 h-70 sm:w-80 sm:h-[300px] lg:w-96 lg:h-[350px] -bottom-32 -left-32"
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
                    className="text-xl font-bold text-gray-800 text-center mb-4"
                    variants={itemVariants}
                >
                    Special Offers
                </motion.h2>
                <motion.div
                    className="flex flex-wrap justify-center gap-4"
                    variants={containerVariants}
                    whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                >
                    {offers.map((offer, idx) => (
                        <motion.div
                            key={idx}
                            className={`${offer.color} flex flex-col items-start min-h-[90px] w-full sm:w-[48%] lg:w-[30%]  rounded-xl shadow px-6 py-2 mb-2`}
                            variants={itemVariants}
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
                <div className="max-w-6xl mx-auto">
                    <motion.h2
                        className="text-2xl font-bold text-gray-800 text-center mb-8"
                        variants={itemVariants}
                    >
                        Why Choose Us
                    </motion.h2>
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-3 gap-2 place-items-center "
                        variants={containerVariants}

                    >
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                className="bg-white p-6 border border-gray-100 text-center rounded-xl shadow-sm m-5 w-50 h-60 sm:w-50 sm:h-60 md:w-50 md:h-60 lg:w-70 lg:h-70 "
                                variants={itemVariants}
                                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)" }}
                            >
                                <motion.div
                                    className="w-14 h-14 sm:w-16 sm:h-16 md:w-14 md:h-14 lg:w-24 lg:h-24 mx-auto bg-yellow-100 rounded-full flex justify-center items-center mb-4 text-yellow-600"
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                    transition={{ type: "spring", stiffness: 300 }}
                                >
                                    <span className="text-2xl">{feature.icon}</span>
                                </motion.div>
                                <h3 className="text-sm sm:text-[18px] font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                <p className="text-gray-600 text-sm sm:text-[15px] ">{feature.desc}</p>
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
                                    boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1),0 10px 10px -5px rgba(0,0,0,0.04)",
                                    backgroundcolor: "#FFFBEB"
                                }}

                            >
                                <Link
                                    to={cat.link}
                                    className="flex flex-col items-center rounded-xl bg-white shadow px-6 py-4 transition"
                                    style={{textDecoration:'none'}}
                                >
                                    <motion.span
                                    className="text-3xl mb-2"
                                    whileHover={{scale:1.1,rotate:5}}
                                    transition={{type:"spring",stiffness:300}}
                                    >
                                        {cat.icon}
                                    </motion.span>
                                    <span 
                                    className="font-medium text-gray-700"
                                    >{cat.name}</span>
                                </Link>
                            </motion.div>
                        ) : (
                            <motion.button>
                                <span>{cat.icon}</span>
                                <span>{cat.name}</span>
                            </motion.button>
                        )


                    ))}
                </motion.div>
            </motion.section>
        </div>
    )

}
