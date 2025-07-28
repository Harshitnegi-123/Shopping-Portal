import React from "react";

const snacksProducts = [
    {
        name: "Potato Chips",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        desc: "Crispy, salty potato chips for snacking.",
        price: "$1.99/pack",
    },
    {
        name: "Nachos",
        image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&q=80",
        desc: "Crunchy nachos, perfect with salsa.",
        price: "$2.49/pack",
    },
    {
        name: "Popcorn",
        image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        desc: "Buttery popcorn for movie nights.",
        price: "$1.29/pack",
    },
    {
        name: "Pretzels",
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        desc: "Salty, crunchy pretzels for a quick bite.",
        price: "$1.79/pack",
    },
    {
        name: "Cookies",
        image: "https://images.unsplash.com/photo-1574226516831-e1dff420e8e9?auto=format&fit=crop&w=400&q=80",
        desc: "Sweet cookies in assorted flavors.",
        price: "$2.99/box",
    },
    {
        name: "Trail Mix",
        image: "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80",
        desc: "Healthy trail mix with nuts and dried fruits.",
        price: "$3.49/pack",
    },
];

export default function Snacks() {
    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-yellow-300 px-6 py-4 flex justify-between items-center shadow">
                <div className="text-2xl font-bold text-gray-800">GrocerEase</div>
                <div className="flex items-center gap-6 text-base font-medium">
                    <a href="/home" className="text-gray-700 hover:text-yellow-700 transition">Home</a>
                    <a href="#" className="text-red-700 font-semibold">Snacks</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Shop</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Cart</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-10 px-4 bg-yellow-50">
                <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 mb-3">Tasty Snacks</h1>
                <p className="text-lg text-gray-700 mb-4 max-w-xl">
                    Satisfy your cravings with our delicious and crunchy snacks, perfect for any time of day.
                </p>
            </section>

            {/* Snacks Grid */}
            <section className="max-w-6xl mx-auto w-full p-4 flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Snacks</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {snacksProducts.map((item) => (
                        <div key={item.name} className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col">
                            <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{item.desc}</p>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-yellow-700 font-bold text-lg">{item.price}</span>
                                    <button className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition">Add</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-gray-400 text-sm border-t border-yellow-100">
                &copy; 2024 GrocerEase. All rights reserved.
            </footer>
        </div>
    );
} 