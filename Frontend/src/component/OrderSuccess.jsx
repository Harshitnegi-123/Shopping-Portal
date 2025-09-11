import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaCheckCircle, FaReceipt, FaExchangeAlt } from "react-icons/fa";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // ✅ PayPal orderId from query params
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const handlePayPalSuccess = async () => {
      try {
        if (orderId) {
          // ✅ Call backend to capture PayPal order
          const captureRes = await fetch(
            `http://localhost:5000/api/order/capture-order/${orderId}`,
            { method: "POST" }
          );

          if (!captureRes.ok) throw new Error("Payment capture failed");

          const captureData = await captureRes.json();

          console.log("✅ Capture Data:", captureData);

          const orderTotal = localStorage.getItem("orderTotal") || "0";
          const orderTotalUSD = localStorage.getItem("orderTotalUSD") || "0";
          const orderDate =
            localStorage.getItem("orderDate") || new Date().toISOString();

          // ✅ Save details for display
          setOrderDetails({
            orderId,
            paymentId: captureData.id, // PayPal transaction ID
            status: captureData.status,
            total: orderTotal,
            totalUSD: orderTotalUSD,
            date: new Date(orderDate).toLocaleDateString(),
          });

          // ✅ Clear local storage after order
          localStorage.removeItem("cart");
          localStorage.removeItem("orderTotal");
          localStorage.removeItem("orderTotalUSD");
          localStorage.removeItem("orderDate");
        } else {
          setError("Invalid payment parameters");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    handlePayPalSuccess();
  }, [orderId]);

  // ----------------- Error Screen -----------------
  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Payment Error
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/cart")}
            className="bg-red-600 text-white px-6 py-3 rounded-xl"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );

  // ----------------- Loading Screen -----------------
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  // ----------------- Success Screen -----------------
  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-yellow-50 p-4">
      <motion.div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full">
        <div className="text-center mb-6">
          <div className="text-8xl text-green-500 mb-4">✅</div>
          <h1 className="text-3xl font-bold">Payment Successful!</h1>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <FaReceipt className="text-yellow-600" /> Order Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Order ID:</span>
              <span>{orderDetails?.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span>Payment ID:</span>
              <span>{orderDetails?.paymentId}</span>
            </div>
            <div className="flex justify-between">
              <span>Date:</span>
              <span>{orderDetails?.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Amount:</span>
              <div className="text-right">
                <span className="text-green-600 font-bold">
                  ${orderDetails?.totalUSD} USD
                </span>
                <span className=" text-sm text-gray-500 flex items-center gap-1">
                  <FaExchangeAlt /> ₹{orderDetails?.total}
                </span>
              </div>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <FaCheckCircle /> {orderDetails?.status}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
