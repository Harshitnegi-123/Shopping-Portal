import React from "react";
import HeroText from "../component/HeroText";
import { Link } from "react-router-dom";
export default function Home() {
    const categories = [
        { name: "Fruits", icon: "🍎" ,link: "/Fruits" },
        { name: "Vegetables", icon: "🥦",link: "/vegetable" },
        { name: "Dairy", icon: "🥛" ,link: "/dairy" },
        { name: "Bakery", icon: "🍞" ,link: "/bakery" },
        { name: "Snacks", icon: "🍪" ,link: "/snacks" },
        { name: "Beverages", icon: "🥤" ,link: "/beverage" },
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
    return (
        <div className="max-h-screen flex flex-col">
            {/* Navbar */}
            <nav className="bg-yellow-300 flex flex-col sm:flex-row px-35 py-4 items-center justify-between">
                <div className="text-2xl font-bold tracking-wide text-gray-800 ">Kiranakart</div>
                <div className=" text-base space-x-6 px-6 text-gray-800 items-center font-medium">
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Home</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Shop</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Cart</a>
                </div>
            </nav>
            {/* Hero text */}
            <section className="flex justify-center flex-col items-center py-10 px-5 ">
                <HeroText />
                <p className="text-lg text-gray-700 mb-6 max-w-xl p-5">
                    Your favorite groceries delivered to your doorstep in minutes. Enjoy fresh produce, daily essentials, and more with KiranaKart.
                </p>
                <a href="#" className="bg-yellow-400 text-yellow-800 rounded-full font-semibold py-3 px-6 transition hover:bg-yellow-500">Shop Now</a>
            </section>
            {/* Offers Section */}
            <section className="max-w-6xl mx-auto w-full p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Special Offers</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {offers.map((offer, idx) => (
                        <div
                            key={idx}
                            className={`rounded-xl shadow px-6 py-4 min-w-[220px] ${offer.color} flex flex-col items-start`}
                        >
                            <div className="font-semibold text-lg text-yellow-900 mb-1">{offer.title}</div>
                            <div className="text-gray-700 text-sm">{offer.desc}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="max-w-6xl mx-auto w-full p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Why Choose GrocerEase?</h2>
                <div className="flex flex-wrap justify-center gap-6">
                    {features.map((f, idx) => (
                        <div key={idx} className="flex flex-col items-center bg-white rounded-xl shadow px-8 py-6 w-64">
                            <span className="text-4xl mb-2">{f.icon}</span>
                            <div className="font-semibold text-gray-800 mb-1">{f.title}</div>
                            <div className="text-gray-500 text-sm text-center">{f.desc}</div>
                        </div>
                    ))}
                </div>
            </section>
            {/* Categories Section */}
            <section className="max-w-6xl mx-auto w-full p-4">
                <h2 className="font-bold text-2xl justify-center  flex mb-4">Shop by category</h2>
                <div className="flex flex-wrap gap-6 justify-center">
                    {categories.map((cat) => (
                        cat.link?(
                             <Link  
                                key={cat.name}
                                to={cat.link}
                                className="flex flex-col items-center bg-white rounded-xl shadow px-6 py-4 hover:bg-yellow-100 transition"
                                style={{ textDecoration: 'none' }}
                            >
                                <span className="text-3xl mb-2">{cat.icon}</span>
                                <span className="font-medium text-gray-700">{cat.name}</span>
                            </Link>

                        ):(
                            <button  
                            key={cat.name} className="flex flex-col items-center bg-white py-4 px-6 rounded-xl shadow hover:bg-yellow-100 transition " disabled>
                            <span className="text-3xl mb-2">{cat.icon}</span>
                            <span className="font-medium text-gray-600">{cat.name}</span>
                        </button>
                        )
                    ))}
                </div>
            </section>
            {/* product grid */}
            <section className="p-4 max-w-6xl  m-auto items-center w-full ">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Popular Groceries</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ">
                    <div className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col">
                        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80" alt="Fresh Apples" className="w-full h-48 object-cover" />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Fresh Apples</h3>
                                <p className="text-gray-500 text-sm mb-2">Crisp and juicy apples, perfect for snacking.</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-yellow-700 font-bold text-lg">$2.99/kg</span>
                                <button className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition">Add</button>
                            </div>
                        </div>
                    </div>
                    {/* Product Card 2 */}
                    <div className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col">
                        <img src="https://images.unsplash.com/photo-1464306076886-debca5e8a6b0?auto=format&fit=crop&w=400&q=80" alt="Organic Bananas" className="w-full h-48 object-cover" />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Organic Bananas</h3>
                                <p className="text-gray-500 text-sm mb-2">Sweet, organic bananas for your daily nutrition.</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-yellow-700 font-bold text-lg">$1.49/kg</span>
                                <button className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition">Add</button>
                            </div>
                        </div>
                    </div>
                    {/* Product Card 3 */}
                    <div className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col">
                        <img src="https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80" alt="Fresh Milk" className="w-full h-48 object-cover" />
                        <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Fresh Milk</h3>
                                <p className="text-gray-500 text-sm mb-2">Locally sourced, farm-fresh milk delivered daily.</p>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-yellow-700 font-bold text-lg">$0.99/L</span>
                                <button className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition">Add</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
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
                &copy; 2024 GrocerEase. All rights reserved.
            </footer>
        </div>
    )
}
