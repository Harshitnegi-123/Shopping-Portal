import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

export default function Success() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);

  const token = searchParams.get("token");
  const orderId = searchParams.get("orderId");

  useEffect(() => {
    const capturePayment = async () => {
      try {
        // Use orderId from URL or token from PayPal
        const paymentId = orderId || token;
        
        if (!paymentId) {
          throw new Error("No payment ID found");
        }

        console.log("🔄 Capturing payment for:", paymentId);
        
        const captureRes = await fetch(
          `${import.meta.env.VITE_BASE_URL}/order/capture-order/${paymentId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!captureRes.ok) {
          const errorData = await captureRes.json();
          throw new Error(errorData.error || "Payment capture failed");
        }

        const captureData = await captureRes.json();
        console.log("✅ Payment captured:", captureData);

        // Save order details to localStorage for OrderSuccess page
        localStorage.setItem('lastOrder', JSON.stringify({
          orderId: paymentId,
          paymentId: captureData.id,
          status: captureData.status,
          amount: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value || "0",
          currency: captureData.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code || "USD"
        }));

        setStatus("success");
        
        // Redirect to order success page after 2 seconds
        setTimeout(() => {
          window.location.href = `/order-success?orderId=${paymentId}`;
        }, 2000);

      } catch (err) {
        console.error("❌ Capture error:", err);
        setError(err.message);
        setStatus("error");
      }
    };

    if (token || orderId) {
      capturePayment();
    } else {
      setError("No payment token found");
      setStatus("error");
    }
  }, [token, orderId]);

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg max-w-md text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-red-600 mb-4">Payment Error</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.href = "/cart"}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <motion.div
        className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"
        />
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {status === "processing" ? "Processing Your Payment" : "Payment Successful!"}
        </h2>
        
        <p className="text-gray-600 mb-6">
          {status === "processing" 
            ? "Please wait while we confirm your payment details." 
            : "Redirecting to order summary..."}
        </p>
        
        <div className="flex justify-center items-center space-x-2">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </motion.div>
    </div>
  );
}