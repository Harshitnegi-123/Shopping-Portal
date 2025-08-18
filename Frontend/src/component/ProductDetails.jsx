import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Productdetails() {
    const { name } = useParams()
    const [product, setproduct] = useState(null)
    const [rating, setRating] = useState(0);
    const [quantity, setQuantity] = useState(1)


    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/name/${name}`)
            .then(res => {
                console.log(res.data);
                setproduct(res.data);
            })
            .catch(err => console.error(err))

    }, [name])

    const handleQuantityChange = (increment) => {
        const newQuantity = quantity + increment
        if (newQuantity >= 1) {
            setQuantity(newQuantity)
        }
    }

    if (!product) {
        return <div>Loading product details...</div>;
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <nav className="mb-8">
                    <ol className="flex items-center space-x-2 text-sm text-gray-600">
                        <li><a href="/home" className="hover:text-yellow-600 transition">Home</a></li>
                        <li>/</li>
                        <li><a href="/products" className="hover:text-yellow-600 transition">Products</a></li>
                        <li>/</li>
                        <li className="text-yellow-700 font-medium">{product.name}</li>
                    </ol>
                </nav>
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Product Image Section */}
                        <div className="bg-gray-100 overflow-hidden relative" >
                            <div className="aspect-square w-full max-w-md mx-auto">
                                <img src={product.imgurl} alt={product.name} className="object-contain w-full h-full hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="absolute top-4 left-4">
                                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm  font-semibold">Featured</span>
                            </div>
                        </div>
                        {/* Product Details Section */}
                        <div className="p-8 lg:p-12">
                            <div className="mb-6">
                                <h1 className="font-bold text-4xl text-gray-900 mb-4 ">{product.name}</h1>
                                <div className="flex items-center mb-4">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} onClick={() => setRating(i + 1)} className={`w-6 h-6 cursor-pointer ${i < rating ? "text-yellow-400" : "text-gray-300"}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 28 28" strokeWidth="1.5" stroke="currentColor">
                                                <path strokeLinecap="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <span className="ml-2 text-gray-600">(24 reviews)</span>
                                </div>
                                <p className="text-gray-600 text-lg leading-relaxed mb-6">{product.description}</p>
                            </div>
                            {/* Price Section */}
                            <div className="mb-8">
                                <div className="flex items-center space-x-4">
                                    <span className="text-4xl text-yellow-700 font-bold">{product.price}</span>
                                    <span className="text-lg line-through text-gray-400">₹{Math.round(product.price * 1.2)}</span>
                                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-semibold">20% OFF</span>
                                </div>
                                <p className="text-gray-600 text-sm mt-2">Free delivery on orders above ₹500</p>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-8">
                                <label className="block text-sm font-medium text-gray-700 mb-3">Quantity</label>
                                <div className=" flex items-center space-x-4">
                                    <div className="flex items-center border border-gray-300 rounded-lg">
                                        <button
                                            onClick={() => handleQuantityChange(-1)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition" >-</button>
                                        <span
                                            className=" font-medium px-6 py-2 border-x border-gray-300">{quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(1)}
                                            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 transition">+</button>
                                    </div>
                                    <span className="text-sm text-gray-500">{quantity}x{product.price}=${quantity * product.price}</span>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div>
                                <button className="w-full bg-yellow-500 text-white px-6 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-600 transform transition duration-300 hover:scale-105 shadow-lg">🛒 Add to Cart - ₹{quantity * product.price}</button>
                                <button className="w-full border-2 border-yellow-500 text-yellow-700 px-6 py-4 rounded-xl font-semibold text-lg transform transition duration-300 hover:scale-105 shadow-lg mt-5 hover:bg-yellow-50">❤️ Add to Wishlist</button>

                            </div>
                            {/* Product Features */}
                            <div className="border-t border-gray-200 mt-8 pt-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Features</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-gray-600">Fresh & Natural</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-gray-600">Fast Delivery</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-gray-600">Quality Assured</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-sm text-gray-600">Easy Returns</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Related Products Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((item) => (
                            <div key={item} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300">
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-2">Related Product {item}</h3>
                                    <p className="text-yellow-700 font-bold">₹299</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}



// Click on product (e.g., Apple)
//        ↓
// URL updates → /product/Apple
//        ↓
// useParams() grabs name = "Apple"
//        ↓
// useEffect() triggers API call to backend
//        ↓
// Backend finds product in MongoDB
//        ↓
// Frontend gets data → setProduct(data)
//        ↓
// React re-renders with product info
//        ↓
// UI shows product details ✅


// Index (i): JavaScript array ka position number, 0 se start hota hai.

// Rating value: User-friendly number, jo 1 se start hota hai.

// Isliye jab aap 3rd star click karte ho:

// Index i = 2 hota hai (kyunki 0, 1, 2 …)

// Hum setRating(i + 1) karte hain → 2 + 1 = 3

// Rating 3 ho jati hai, jo user expect karta hai.