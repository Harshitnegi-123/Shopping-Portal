import React from "react";

const bakeryProducts = [
    {
        name: "Bread",
        image: "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80",
        desc: "Freshly baked bread, soft and delicious.",
        price: "$2.49/loaf",
    },
    {
        name: "Croissant",
        image: "https://images.unsplash.com/photo-1465101178521-c1a9136a3b41?auto=format&fit=crop&w=400&q=80",
        desc: "Buttery, flaky croissants for breakfast.",
        price: "$1.99/each",
    },
    {
        name: "Muffin",
        image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
        desc: "Moist, sweet muffins in various flavors.",
        price: "$2.29/each",
    },
    {
        name: "Bagel",
        image: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
        desc: "Chewy, golden bagels perfect for any spread.",
        price: "$1.49/each",
    },
    {
        name: "Cake",
        image: "https://images.unsplash.com/photo-1574226516831-e1dff420e8e9?auto=format&fit=crop&w=400&q=80",
        desc: "Delicious cakes for every celebration.",
        price: "$15.99/cake",
    },
    {
        name: "Donut",
        image: "https://images.unsplash.com/photo-1506089676908-3592f7389d4d?auto=format&fit=crop&w=400&q=80",
        desc: "Sweet, glazed donuts in assorted flavors.",
        price: "$1.29/each",
    },
];

export default function Bakery() {
    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-yellow-300 px-6 py-4 flex justify-between items-center shadow">
                <div className="text-2xl font-bold text-gray-800">GrocerEase</div>
                <div className="flex items-center gap-6 text-base font-medium">
                    <a href="/" className="text-gray-700 hover:text-yellow-700 transition">Home</a>
                    <a href="#" className="text-orange-700 font-semibold">Bakery</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Shop</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Cart</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-10 px-4 bg-yellow-50">
                <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 mb-3">Fresh Bakery Products</h1>
                <p className="text-lg text-gray-700 mb-4 max-w-xl">
                    Enjoy our range of freshly baked goods, perfect for every occasion and craving.
                </p>
            </section>

            {/* Bakery Grid */}
            <section className="max-w-6xl mx-auto w-full p-4 flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Bakery Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {bakeryProducts.map((item) => (
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