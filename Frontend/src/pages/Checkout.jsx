import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PayButton from "../component/PayButton";
import {
  FaMapMarkerAlt,
  FaUser,
  FaPhone,
  FaHome,
  FaCity,
  FaGlobe,
  FaArrowLeft,
  FaShoppingCart,
  FaShieldAlt,
  FaExchangeAlt,
} from "react-icons/fa";

export default function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cartFromState = state?.cart || { items: [], total: 0 };

  const [address, setAddress] = useState({
    name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (!cartFromState || !cartFromState.items || cartFromState.items.length === 0) {
      navigate("/cart");
    }
  }, [cartFromState, navigate]);

  useEffect(() => {
    // Validate required fields
    const requiredFields = ["name", "phone", "line1", "city", "state", "pincode"];
    const isValid = requiredFields.every((field) => address[field] && address[field].trim() !== "");
    setIsFormValid(isValid);
  }, [address]);

  // Convert INR to USD
  const convertToUSD = (amountInINR) => {
    const exchangeRate = 0.012; // 1 INR = 0.012 USD
    return (amountInINR * exchangeRate).toFixed(2);
  };

  const totalAmount = useMemo(() => {
    const subtotal = Number(cartFromState.total || 0);
    const tax = subtotal * 0.05;
    return subtotal + tax;
  }, [cartFromState]);

  const totalAmountUSD = useMemo(() => {
    return convertToUSD(totalAmount);
  }, [totalAmount]);

  const user = useMemo(() => {
    try {
      const str = localStorage.getItem("user");
      return str ? JSON.parse(str) : {};
    } catch (e) {
      return {};
    }
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } } };
  const cardVariants = { hidden: { scale: 0.95, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200 } }, hover: { scale: 1.02, transition: { type: "spring", stiffness: 300 } } };
  const inputVariants = { focus: { scale: 1.02, transition: { type: "spring", stiffness: 300 } } };

  return (
    <motion.div className="min-h-screen w-full p-6 bg-gradient-to-b from-yellow-50 to-white" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="max-w-6xl mx-auto">
        <motion.div className="mb-8" variants={itemVariants} initial="hidden" animate="visible">
          <div className="flex items-center gap-3 mb-4">
            <motion.div whileHover={{ rotate: 360 }} transition={{ duration: 0.6 }} className="text-3xl">
              🛒
            </motion.div>
            <h1 className="text-4xl font-bold text-gray-800">Checkout</h1>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full"></div>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-8" variants={containerVariants} initial="hidden" animate="visible">
          {/* Shipping Address */}
          <motion.div className="lg:col-span-2" variants={itemVariants}>
            <motion.div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100" variants={cardVariants} whileHover="hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaMapMarkerAlt className="text-yellow-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: FaUser, label: "Full Name", key: "name", placeholder: "Enter your full name" },
                  { icon: FaPhone, label: "Phone Number", key: "phone", placeholder: "Enter your phone number" },
                  { icon: FaHome, label: "Address Line 1", key: "line1", placeholder: "Street address, apartment, suite, etc." },
                  { icon: FaHome, label: "Address Line 2 (Optional)", key: "line2", placeholder: "Additional address information" },
                  { icon: FaCity, label: "City", key: "city", placeholder: "Enter your city" },
                  { icon: FaGlobe, label: "State", key: "state", placeholder: "Enter your state" },
                  { icon: FaMapMarkerAlt, label: "Pincode", key: "pincode", placeholder: "Enter your pincode" },
                ].map((field, idx) => (
                  <motion.div key={idx} variants={inputVariants} whileFocus="focus" className={field.key === "line1" || field.key === "line2" || field.key === "pincode" ? "sm:col-span-2" : ""}>
                    <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <field.icon className="text-yellow-600" />
                      {field.label}
                    </label>
                    <input
                      className="w-full border-2 border-gray-200 rounded-xl p-4 focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-300 outline-none"
                      placeholder={field.placeholder}
                      value={address[field.key]}
                      onChange={(e) => setAddress({ ...address, [field.key]: e.target.value })}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Order Summary */}
          <motion.div className="lg:col-span-1" variants={itemVariants}>
            <motion.div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 h-fit" variants={cardVariants} whileHover="hover">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <FaShoppingCart className="text-yellow-600 text-xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Order Summary</h2>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium">Items</span>
                  <span className="font-semibold">{cartFromState.items?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium">Subtotal</span>
                  <div className="text-right">
                    <span className="font-semibold block">${convertToUSD(cartFromState.total || 0)} USD</span>
                    <span className="text-xs text-gray-500">${Number(cartFromState.total || 0).toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="font-medium">Tax (5%)</span>
                  <div className="text-right">
                    <span className="font-semibold block">${convertToUSD((cartFromState.total || 0) * 0.05)} USD</span>
                    <span className="text-xs text-gray-500">${Number((cartFromState.total || 0) * 0.05).toFixed(2)}</span>
                  </div>
                </div>
                <div className="border-t-2 border-gray-200 my-4"></div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl">
                  <span className="font-bold text-lg">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-yellow-700 block">${totalAmountUSD} USD</span>
                    <span className="text-sm text-yellow-600">${Number(totalAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Currency Notice */}
              <motion.div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-200" variants={itemVariants}>
                <div className="flex items-start gap-2">
                  <FaExchangeAlt className="text-gray-600 mt-1 flex-shrink-0 text-sm" />
                  <p className="text-gray-600 text-xs">
                    Payment will be processed in USD. Your card will be charged in USD at current exchange rates.
                  </p>
                </div>
              </motion.div>

              <div className="mt-6">
                <AnimatePresence mode="wait">
                  {!isFormValid && (
                    <motion.div
                      className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      <p className="text-red-600 text-sm text-center">Please fill in all required fields to proceed</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                {/* ✅ Updated: Pass cartItems prop to ensure items are not empty */}
                {isFormValid && <PayButton amount={totalAmount} cartItems={cartFromState.items} />}
              </div>

              <motion.button
                onClick={() => navigate("/cart")}
                className="w-full mt-4 text-yellow-700 hover:text-yellow-800 font-medium flex items-center justify-center gap-2 transition-colors duration-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaArrowLeft />
                Back to cart
              </motion.button>
            </motion.div>

            {/* Security Notice */}
            <motion.div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-200" variants={itemVariants} initial="hidden" animate="visible">
              <div className="flex items-start gap-3">
                <FaShieldAlt className="text-blue-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 font-medium text-sm mb-1">Secure Checkout</p>
                  <p className="text-blue-600 text-xs">Your payment information is encrypted and secure. We never store your card details.</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}