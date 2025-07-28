import React from "react";

const categories = [
    { name: "Fruits", icon: "🍎" },
    { name: "Vegetables", icon: "🥦" },
    { name: "Dairy", icon: "🥛" },
    { name: "Bakery", icon: "🍞" },
    { name: "Snacks", icon: "🍪" },
    { name: "Beverages", icon: "🥤" },
];

export default function Cart() {
    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-yellow-300 px-6 py-4 flex justify-between items-center shadow">
                <div className="text-2xl font-bold text-gray-800">GrocerEase</div>
                <div className="flex items-center gap-6 text-base font-medium">
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Home</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Shop</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Cart</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-12 px-4 bg-yellow-50">
                <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Fresh Groceries Delivered Fast</h1>
                <p className="text-lg text-gray-700 mb-6 max-w-xl">
                    Your favorite groceries delivered to your doorstep in minutes. Enjoy fresh produce, daily essentials, and more with GrocerEase.
                </p>
                <a href="#" className="inline-block px-6 py-3 bg-yellow-400 text-yellow-900 font-semibold rounded-full shadow hover:bg-yellow-500 transition">Shop Now</a>
            </section>

            {/* Categories Section */}
            <section className="max-w-6xl mx-auto w-full p-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Shop by Category</h2>
                <div className="flex flex-wrap justify-center gap-4">
                    {categories.map((cat) => (
                        <button
                            key={cat.name}
                            className="flex flex-col items-center bg-white rounded-xl shadow px-6 py-4 hover:bg-yellow-100 transition"
                        >
                            <span className="text-3xl mb-2">{cat.icon}</span>
                            <span className="font-medium text-gray-700">{cat.name}</span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Product Grid */}
            <section className="max-w-6xl mx-auto w-full p-4 flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Popular Groceries</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {/* Product Card 1 */}
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

            {/* Footer */}
            <footer className="mt-12 py-6 text-center text-gray-400 text-sm border-t border-yellow-100">
                &copy; 2024 GrocerEase. All rights reserved.
            </footer>
        </div>
    );
}
