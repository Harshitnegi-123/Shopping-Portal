import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export default function PayButton({ amount }) {
  const paypalRef = useRef();

  useEffect(() => {
    // Store order total and date for later use
    localStorage.setItem("orderTotal", amount);
    localStorage.setItem("orderTotalUSD", (amount / 80).toFixed(2)); // Approximate INR to USD conversion
    localStorage.setItem("orderDate", new Date().toISOString());

    // Load PayPal script
    window.paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: (amount / 80).toFixed(2), // Convert INR to USD
                },
              },
            ],
          });
        },
        onApprove: (data, actions) => {
          // Redirect to success page with PayPal order ID
          window.location.href = `/success?token=${data.orderID}&source=paypal`;
        },
        onError: (err) => {
          console.error("PayPal Error:", err);
          window.location.href = "/cancel";
        },
        style: {
          color: "blue",
          shape: "rect",
          layout: "vertical",
        },
      })
      .render(paypalRef.current);
  }, [amount]);

  return (
    <div className="space-y-4">
      <div ref={paypalRef}></div>
      <div className="flex items-center justify-center my-4">
        <div className="border-t border-gray-300 flex-grow"></div>
        <div className="mx-4 text-gray-500 text-sm">OR</div>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>
      <button
        className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300"
      >
        Debit or Credit Card
      </button>
    </div>
  );
}

