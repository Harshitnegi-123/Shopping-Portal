// OrderSuccess.jsx
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

  const orderId = searchParams.get("orderID");  // Mongo ID from redirect
  const paypalOrderId = searchParams.get("paypalOrderId");  // PayPal ID from redirect
  const source = searchParams.get("source");

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!orderId) {
          throw new Error("Missing order ID. Please try placing the order again.");
        }

        console.log("🔄 Displaying order success...", { orderId, paypalOrderId, source });

        // ✅ Fetch the saved order from backend (no need to save/capture again)
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication required");

        const res = await fetch(`${import.meta.env.VITE_BASE_URL}/order/myorders`, {  // Reuse myorders endpoint
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) throw new Error("Failed to fetch order details");

        const allOrders = await res.json();
        const recentOrder = allOrders.find(o => o._id === orderId);  // Find by ID

        if (!recentOrder) {
          throw new Error("Order not found. Please check your order history.");
        }

        console.log("✅ Fetched order:", recentOrder);

        // Set details for display
        setOrderDetails({
          orderId: recentOrder._id,
          paymentId: recentOrder.paypal?.paymentId || paypalOrderId,
          status: recentOrder.status || "Completed",
          total: recentOrder.amount,  // INR
          totalUSD: (recentOrder.amount * 0.012).toFixed(2),  // Approximate
          date: new Date(recentOrder.paidAt || recentOrder.createdAt).toLocaleDateString(),
          items: recentOrder.items || []
        });

        // ✅ Clear stored data (only if success)
        ["cart", "orderTotal", "orderTotalUSD", "orderDate", "pendingOrderCart", "paypalOrderId"].forEach(key => localStorage.removeItem(key));

      } catch (err) {
        console.error("❌ Success handling error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId && source === "paypal") {
      handleSuccess();
    } else {
      setError("Invalid success parameters");
      setIsLoading(false);
    }
  }, [orderId, paypalOrderId, source]);


  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Order Processing Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="w-full bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors"
            >
              Return to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-50">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-bold mb-4">Processing Your Order...</h1>
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600 mt-4">Please don't close this page</p>
      </div>
    );
  }

  // ✅ Success
  return (
    <motion.div
      className="min-h-screen flex items-center justify-center bg-yellow-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full"
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      >
        <div className="text-center mb-6">
          <motion.div
            className="text-8xl text-green-500 mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            ✅
          </motion.div>
          <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>
          <p className="text-gray-600 mt-2">Your order has been placed successfully</p>
        </div>

        <div className="bg-yellow-50 p-6 rounded-2xl mb-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <FaReceipt className="text-yellow-600" /> Order Details
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="font-medium">Order ID:</span>
              <span className="text-sm">{orderDetails?.orderId?.slice(-8) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Payment ID:</span>
              <span className="text-sm">{orderDetails?.paymentId?.slice(-8) || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date:</span>
              <span>{orderDetails?.date}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <div className="text-right">
                <span className="text-green-600 font-bold">
                  ${orderDetails?.totalUSD} USD
                </span>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <FaExchangeAlt /> ₹{orderDetails?.total}
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                <FaCheckCircle /> {orderDetails?.status}
              </span>
            </div>
            {orderDetails?.items && orderDetails.items.length > 0 && (
              <div className="pt-3 border-t">
                <span className="font-medium">Items: {orderDetails.items.length}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/orders")}
            className="w-full bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-colors font-semibold"
          >
            View Order History
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

}
