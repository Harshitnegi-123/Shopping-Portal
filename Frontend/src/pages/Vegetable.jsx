import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer, Bounce } from "react-toastify";

export default function Vegetable() {
  const [vegetables, setvegetables] = useState([])
  const [loading, setLoading] = useState(true) // Loading state add kiya
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true) // Start loading
    axios.get(`${import.meta.env.VITE_BASE_URL}/api/products/category/vegetables`)
      .then(res => {
        setvegetables(res.data)
        setLoading(false) // Stop loading
      })
      .catch(err => {
        console.error(err)
        setLoading(false) // Error pe bhi stop
      })
  }, [])

  const handleAddToCart = async (productId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        navigate("/");
        return;
      }
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/cart/add`,
        { productId, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success("Successfully added")
      console.log(res.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Failed to add to cart ❌")
        console.error(error);
      }
    }
  }

  // Container animation for stagger effect
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // Each child 0.1s delay se aayega
      }
    }
  }

  // Individual card animation
  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  }

  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-10 px-4 bg-yellow-50">
        <h1 className="text-4xl md:text-5xl font-extrabold text-yellow-800 mb-3">Fresh Vegetables</h1>
        <p className="text-lg text-gray-700 mb-4 max-w-xl">
          Discover our variety of fresh, healthy, and delicious vegetables delivered to your doorstep.
        </p>
      </section>

      {/* Vegetables Grid */}
      <section className="max-w-6xl mx-auto w-full p-4 flex-1">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Vegetables</h2>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden animate-pulse">
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 rounded-full w-24"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Products Grid with Stagger Animation */
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {vegetables.map((veg) => (
              <motion.div
                key={veg._id}
                className="bg-white rounded-2xl shadow border border-yellow-100 overflow-hidden flex flex-col"
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                }}
              >
                <Link to={`/product/${veg.name}`}>
                  <motion.img
                    src={veg.imgurl}
                    alt={veg.name}
                    className="w-full h-48 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{veg.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{veg.description}</p>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-yellow-700 font-bold text-lg">${veg.price}</span>
                    <motion.button
                      onClick={() => handleAddToCart(veg._id)}
                      className="px-4 py-1 text-sm rounded-full bg-yellow-400 text-yellow-900 font-semibold hover:bg-yellow-500 transition"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Add to cart
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Bounce}
        progressClassName="!bg-yellow-400"
      />
    </div>
  );
}