import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Dairy() {
    const [dairyProducts, setdairyProducts] = useState([])
    useEffect(() => {
      axios.get("http://localhost:5000/api/products/category/dairy")
      .then(res=> setdairyProducts(res.data))
      .catch(err=>console.error(err))
    }, [])
    
    return (
        <div className="min-h-screen bg-yellow-50 flex flex-col">
            {/* Navbar */}
            <nav className="bg-yellow-300 px-6 py-4 flex justify-between items-center shadow">
                <div className="text-2xl font-bold text-gray-800">KiranaKart</div>
                <div className="flex items-center gap-6 text-base font-medium">
                    <a href="/" className="text-gray-700 hover:text-yellow-700 transition">Home</a>
                    <a href="#" className="text-blue-700 font-semibold">Dairy</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Shop</a>
                    <a href="#" className="text-gray-700 hover:text-yellow-700 transition">Cart</a>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="flex flex-col items-center justify-center text-center py-10 px-4 bg-yellow-50">
                <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 mb-3">Fresh Dairy Products</h1>
                <p className="text-lg text-gray-700 mb-4 max-w-xl">
                    Browse our selection of fresh, high-quality dairy products delivered to your home.
                </p>
            </section>

            {/* Dairy Grid */}
            <section className="max-w-6xl mx-auto w-full p-4 flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Dairy Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    {dairyProducts.map((item) => (
                        <div key={item.name} className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col">
                            <img src={item.imgurl} alt={item.name} className="w-full h-48 object-cover" />
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                                    <p className="text-gray-500 text-sm mb-2">{item.description}</p>
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

