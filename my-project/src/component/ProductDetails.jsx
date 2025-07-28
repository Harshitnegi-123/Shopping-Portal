import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Productdetails() {
    const { name } = useParams()
    const [product, setproduct] = useState(null)
    const [rating, setRating] = useState(0);


    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/name/${name}`)
            .then(res => {
                console.log(res.data);
                setproduct(res.data);
            })
            .catch(err => console.error(err))

    }, [name])

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
                        <div>
                            <div>
                                <h1>{product.name}</h1>
                                <div className="flex items-center">
                                    <div className="flex text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} onClick={() => setRating(i + 1)} className={`w-6 h-6 cursor-pointer ${i < rating ? "text-yellow-400":"text-gray-300"}`} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                            </svg>


                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
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
