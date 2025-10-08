// import { useEffect, useRef } from "react";
// import { motion } from "framer-motion"; // If you're using it elsewhere, but not required here

// export default function PayButton({ amount, cartItems = [] }) {
//   const paypalRef = useRef();

//   useEffect(() => {
//     // ✅ Prioritize prop, fallback to localStorage for persistence
//     let cart = cartItems || JSON.parse(localStorage.getItem("cart") || "[]");

//     // Store order data for persistence (INR amount for DB, USD for PayPal)
//     localStorage.setItem("orderTotal", amount.toString());
//     localStorage.setItem("orderTotalUSD", (amount * 0.012).toFixed(2)); // Adjust exchange rate if needed
//     localStorage.setItem("orderDate", new Date().toISOString());
//     localStorage.setItem("pendingOrderCart", JSON.stringify(cart)); // Backup cart

//     console.log("💾 Stored order data in PayButton:", {
//       orderTotal: amount,
//       orderTotalUSD: (amount * 0.012).toFixed(2),
//       cartItemsCount: cart.length,
//       sampleItem: cart[0]?.name || "N/A" // Debug: Log first item name
//     });

//     // ✅ Only render PayPal if cart has items (prevents empty orders)
//     if (cart.length === 0) {
//       console.warn("⚠️ Cart is empty in PayButton! PayPal buttons will not render.");
//       return; // Skips PayPal render but keeps the component visible (debit button shows)
//     }

//     // ✅ Load PayPal script only if SDK is available and cart is valid
//     if (window.paypal) {
//       window.paypal
//         .Buttons({
//           createOrder: async (data, actions) => {
//             try {
//               const orderData = {
//                 amount: (amount * 0.012).toFixed(2) // USD for PayPal creation
//               };

//               console.log("🔄 Creating PayPal order for USD:", orderData.amount);

//               const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/order/create-order`, {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(orderData),
//               });

//               if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.error || "Failed to create PayPal order");
//               }

//               const order = await response.json();
//               console.log("✅ Created PayPal order:", order.id);

//               return order.id;
//             } catch (error) {
//               console.error("❌ Error creating order:", error);
//               throw error; // PayPal will show error to user
//             }
//           },

//           onApprove: async (data, actions) => {
//             try {
//               console.log("🎉 Payment approved:", data);

//               // ✅ Retrieve cart: Prioritize prop, fallback to stored
//               const persistedCart = cartItems.length > 0 ? cartItems : JSON.parse(localStorage.getItem("pendingOrderCart") || "[]");
//               const totalAmount = Number(localStorage.getItem("orderTotal") || amount);

//               if (persistedCart.length === 0) {
//                 throw new Error("Cart is empty. Cannot save order.");
//               }

//               const token = localStorage.getItem("token");
//               if (!token) {
//                 throw new Error("Authentication required. Please log in.");
//               }

//               console.log("📦 Preparing order payload with items:", persistedCart.length);

//               // ✅ Single API call: Backend handles capture + save
//               const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/order`, {
//                 method: "POST",
//                 headers: {
//                   "Content-Type": "application/json",
//                   Authorization: `Bearer ${token}`,
//                 },
//                 body: JSON.stringify({
//                   items: persistedCart,  // Full cart items (non-empty)
//                   amount: totalAmount,   // INR total for DB
//                   paypal: { orderId: data.orderID },
//                   capturePayment: true   // Flag for backend to capture PayPal
//                 }),
//               });

//               if (!res.ok) {
//                 const errorData = await res.json();
//                 console.error("❌ Order save failed:", errorData);
//                 throw new Error(errorData.error || "Failed to save order");
//               }

//               const savedOrder = await res.json();
//               console.log("✅ Order saved with capture:", savedOrder._id);

//               // ✅ Store PayPal ID for success page fallback
//               localStorage.setItem("paypalOrderId", data.orderID);

//               // ✅ Redirect to success with Mongo ID and PayPal ID
//               window.location.href = `/order-success?orderID=${savedOrder._id}&paypalOrderId=${data.orderID}&source=paypal`;
//             } catch (error) {
//               console.error("❌ Error in onApprove:", error);
//               alert(`Payment approved but order save failed: ${error.message}. Please contact support.`);
//               window.location.href = "/cancel?error=order_save_failed";
//             }
//           },

//           onError: (err) => {
//             console.error("❌ PayPal Error:", err);
//             alert("Payment failed. Please try again or contact support.");
//             // Stay on page for retry (no redirect)
//           },

//           onCancel: (data) => {
//             console.log("⚠️ Payment cancelled:", data);
//             // Clear temporary storage on cancel
//             localStorage.removeItem("pendingOrderCart");
//             window.location.href = "/cart?cancelled=true";
//           },

//           style: {
//             color: "blue",
//             shape: "rect",
//             layout: "vertical",
//             height: 45,
//           },
//         })
//         .render(paypalRef.current);
//     } else {
//       console.error("❌ PayPal SDK not loaded. Ensure the PayPal script is included in your index.html.");
//       // Optionally: Show a fallback message in the ref div
//     }
//   }, [amount, cartItems]);  // Re-run if amount or cartItems change

//   return (
//     <div className="space-y-4">
//       {/* ✅ PayPal container: Renders buttons if valid, or error message if empty */}
//       <div
//         ref={paypalRef}
//         className="min-h-[45px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
//       >
//         {cartItems.length === 0 && (
//           <p className="text-red-500 text-sm italic text-center px-4">
//             ⚠️ Add items to your cart to pay with PayPal
//           </p>
//         )}
//         {/* If PayPal loads, buttons will fill this div; otherwise, it's empty but styled */}
//       </div>

//       {/* ✅ Always show divider and debit button (independent of PayPal/cart) */}
//       <div className="flex items-center justify-center my-4">
//         <div className="border-t border-gray-300 flex-grow"></div>
//         <div className="mx-4 text-gray-500 text-sm">OR</div>
//         <div className="border-t border-gray-300 flex-grow"></div>
//       </div>
//       <button
//         className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300 opacity-50 cursor-not-allowed"
//         disabled
//         title="Debit or Credit Card integration coming soon"
//       >
//         💳 Debit or Credit Card (Coming Soon)
//       </button>
//     </div>
//   );
// }



import { useEffect, useRef } from "react";

export default function PayButton({ amount, cartItems = [] }) {
  const paypalRef = useRef();

  useEffect(() => {
    let cart = cartItems.length > 0 ? cartItems : JSON.parse(localStorage.getItem("cart") || "[]");

    if (cart.length === 0) {
      console.warn("⚠️ Cart is empty!");
      return;
    }

    // ✅ NEW: Validate and clean cart items (prevent NaN)
    const validatedCart = cart
      .map(item => {
        const price = parseFloat(item.price);  // Clean price (remove $ or invalid)
        const quantity = parseInt(item.quantity) || 1;  // Default 1 if invalid
        
        if (isNaN(price) || price <= 0) {
          console.error("❌ Invalid price in cart:", item);
          return null;  // Skip invalid item
        }
        
        return {
          ...item,
          price: price,  // Cleaned number
          quantity: quantity
        };
      })
      .filter(item => item !== null);  // Remove invalid items

    if (validatedCart.length === 0) {
      console.error("❌ No valid items in cart after validation!");
      alert("Invalid cart items. Please refresh and try again.");
      return;
    }

    const amountINR = Number(amount);
    if (isNaN(amountINR) || amountINR <= 0) {
      console.error("❌ Invalid total amount:", amount);
      return;
    }

    // Recalculate USD with validated items
    const itemsTotalUSD = validatedCart.reduce((sum, item) => sum + (item.price * 0.012 * item.quantity), 0);
    const amountUSD = parseFloat(itemsTotalUSD.toFixed(2));

    // Store validated data
    localStorage.setItem("orderTotal", amountINR.toString());
    localStorage.setItem("orderTotalUSD", amountUSD.toString());
    localStorage.setItem("pendingOrderCart", JSON.stringify(validatedCart));

    console.log("💾 Validated order data:", {
      INR: amountINR,
      USD: amountUSD,
      validItems: validatedCart.length,
      samplePrice: validatedCart[0]?.price  // Debug: First item's clean price
    });

    if (window.paypal) {
      window.paypal
        .Buttons({
          createOrder: async (data, actions) => {
            try {
              // ✅ Use validated cart for orderData
              const orderData = {
                items: validatedCart.map(item => ({
                  name: (item.name || "Product").substring(0, 127),
                  description: (item.description || item.category || "Product").substring(0, 127),
                  price: parseFloat((item.price * 0.012).toFixed(2)),  // INR → USD, safe now
                  quantity: item.quantity.toString()  // String for PayPal
                })),
                totalAmount: amountUSD.toFixed(2)  // String with 2 decimals
              };

              // ✅ Double-check no NaN before send
              const hasNaN = orderData.items.some(item => isNaN(item.price)) || isNaN(parseFloat(orderData.totalAmount));
              if (hasNaN) {
                throw new Error("Invalid amount calculation – please refresh cart");
              }

              console.log("🔄 Creating PayPal order for USD:", orderData.totalAmount);
              console.log("📦 Validated items:", orderData.items);

              const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/order/create-order`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(orderData),
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Create order failed:", errorData);
                throw new Error(errorData.error || "Failed to create order");
              }

              const result = await response.json();
              console.log("✅ PayPal order created:", result.orderID);

              return result.orderID;
            } catch (error) {
              console.error("❌ Error creating order:", error);
              alert("Failed to create order: " + error.message);
              throw error;
            }
          },

          onApprove: async (data, actions) => {
            try {
              console.log("🎉 Payment approved, PayPal Order ID:", data.orderID);

              const token = localStorage.getItem("token");
              if (!token) {
                throw new Error("Please login to complete order");
              }

              // Use validated cart
              const persistedCart = validatedCart.length > 0 ? validatedCart : JSON.parse(localStorage.getItem("pendingOrderCart") || "[]");
              const totalAmount = Number(localStorage.getItem("orderTotal") || amount);

              if (persistedCart.length === 0) {
                throw new Error("Cart is empty");
              }

              console.log("💾 Saving order with", persistedCart.length, "validated items");

              const response = await fetch(
                `${import.meta.env.VITE_BASE_URL}/api/order`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                  },
                  body: JSON.stringify({
                    items: persistedCart.map(item => ({
                      name: item.name,
                      price: item.price,  // INR for DB
                      quantity: item.quantity,
                      productId: item._id || item.productId  // Handle ID
                    })),
                    amount: totalAmount,  // INR
                    paypal: { orderId: data.orderID },
                    capturePayment: true
                  }),
                }
              );

              if (!response.ok) {
                const errorData = await response.json();
                console.error("❌ Order save failed:", errorData);
                throw new Error(errorData.error || "Failed to save order");
              }

              const savedOrder = await response.json();
              console.log("✅ Order saved:", savedOrder._id);

              // Clear storage
              localStorage.removeItem("cart");
              localStorage.removeItem("pendingOrderCart");
              localStorage.removeItem("orderTotal");
              localStorage.removeItem("orderTotalUSD");

              alert("✅ Payment successful! Order ID: " + savedOrder._id);
              window.location.href = `/order-success?orderID=${savedOrder._id}&paypalOrderId=${data.orderID}`;
            } catch (error) {
              console.error("❌ Error saving order:", error);
              alert(`Payment approved but save failed: ${error.message}. Contact support with PayPal ID: ${data.orderID}`);
            }
          },

          onError: (err) => {
            console.error("❌ PayPal Error:", err);
            alert("Payment failed. Please try again.");
          },

          onCancel: (data) => {
            console.log("⚠️ Payment cancelled");
            localStorage.removeItem("pendingOrderCart");
            window.location.href = "/cart?cancelled=true";
          },

          style: {
            color: "blue",
            shape: "rect",
            layout: "vertical",
            height: 45,
          },
        })
        .render(paypalRef.current);
    } else {
      console.error("❌ PayPal SDK not loaded");
    }
  }, [amount, cartItems]);  // Dependencies same
  

  return (
    <div className="space-y-4">
      <div
        ref={paypalRef}
        className="min-h-[45px] flex items-center justify-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"
      >
        {cartItems.length === 0 && (
          <p className="text-red-500 text-sm italic text-center px-4">
            ⚠️ Add items to your cart to pay with PayPal
          </p>
        )}
      </div>

      <div className="flex items-center justify-center my-4">
        <div className="border-t border-gray-300 flex-grow"></div>
        <div className="mx-4 text-gray-500 text-sm">OR</div>
        <div className="border-t border-gray-300 flex-grow"></div>
      </div>

      <button
        className="w-full py-4 px-6 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-300 opacity-50 cursor-not-allowed"
        disabled
        title="Debit or Credit Card integration coming soon"
      >
        💳 Debit or Credit Card (Coming Soon)
      </button>
    </div>
  );
}