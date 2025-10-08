// import express from "express";
// import paypal from "@paypal/checkout-server-sdk";
// import getClient from "../Config/paypal.js";
// import Order from "../Models/order.js";
// import verifytoken from "../Middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ Create PayPal order with proper validation
// router.post("/create-order", async (req, res) => {
//   try {
//     const { items, totalAmount } = req.body;

//     // Validation
//     if (!items || items.length === 0) {
//       return res.status(400).json({ 
//         error: "Cart is empty" 
//       });
//     }

//     // Calculate items total
//     let itemsTotal = 0;
//     const paypalItems = items.map(item => {
//       const itemPrice = parseFloat(item.price);
//       const itemQuantity = parseInt(item.quantity);
//       const itemTotal = itemPrice * itemQuantity;

//       itemsTotal += itemTotal;

//       return {
//         name: item.name.substring(0, 127), // PayPal max 127 chars
//         description: item.description?.substring(0, 127) || "Product",
//         unit_amount: {
//           currency_code: "USD",
//           value: itemPrice.toFixed(2) // ⚠️ Must be string with 2 decimals
//         },
//         quantity: itemQuantity.toString(), // ⚠️ Must be string
//         category: "PHYSICAL_GOODS"
//       };
//     });

//     // Round totals to 2 decimals
//     itemsTotal = parseFloat(itemsTotal.toFixed(2));
//     const finalTotal = parseFloat(totalAmount.toFixed(2));

//     // ⚠️ CRITICAL: Validation - amounts must match
//     if (Math.abs(itemsTotal - finalTotal) > 0.01) {
//       console.error('❌ Amount mismatch:', { 
//         itemsTotal, 
//         finalTotal,
//         difference: Math.abs(itemsTotal - finalTotal)
//       });
//       return res.status(400).json({
//         error: "Amount calculation mismatch",
//         details: { calculated: itemsTotal, sent: finalTotal }
//       });
//     }

//     console.log("🔄 Creating PayPal order for USD:", finalTotal);
//     console.log("📦 Items:", paypalItems.length);

//     // Create PayPal request
//     const request = new paypal.orders.OrdersCreateRequest();
//     request.prefer("return=representation");
//     request.requestBody({
//       intent: "CAPTURE",
//       purchase_units: [{
//         amount: {
//           currency_code: "USD",
//           value: finalTotal.toFixed(2), // ⚠️ Total as string
//           breakdown: {
//             item_total: {
//               currency_code: "USD",
//               value: itemsTotal.toFixed(2) // ⚠️ Must match items sum
//             }
//           }
//         },
//         items: paypalItems,
//         description: `Order of ${items.length} items`
//       }],
//       application_context: {
//         brand_name: "Shopping Portal",
//         landing_page: "BILLING",
//         user_action: "PAY_NOW",
//         return_url: `${process.env.CLIENT_URL}/order-success`, // ⚠️ Use env variable
//         cancel_url: `${process.env.CLIENT_URL}/cart`
//       }
//     });

//     // Execute PayPal request
//     const client = getClient();
//     const order = await client.execute(request);

//     console.log("✅ PayPal order created:", order.result.id);
//     console.log("💰 Amount:", order.result.purchase_units[0].amount.value);

//     res.json({
//       success: true,
//       orderID: order.result.id,
//       status: order.result.status
//     });

//   } catch (err) {
//     console.error("❌ PayPal order creation error:", err);
//     console.error("Error details:", err.details);

//     res.status(500).json({ 
//       error: err.message,
//       details: err.details || []
//     });
//   }
// });

// // ✅ Capture PayPal order
// router.post("/capture-order/:orderId", async (req, res) => {
//   const { orderId } = req.params;
//   console.log("🔄 Capturing PayPal order:", orderId);

//   try {
//     const request = new paypal.orders.OrdersCaptureRequest(orderId);
//     request.requestBody({});
//     const client = getClient();
//     const response = await client.execute(request);

//     console.log("✅ PayPal order captured:", {
//       id: response.result.id,
//       status: response.result.status
//     });

//     return res.json({
//       success: true,
//       id: response.result.id,
//       status: response.result.status,
//       details: response.result,
//     });
//   } catch (err) {
//     if (err.statusCode === 422 && err.message.includes("ORDER_ALREADY_CAPTURED")) {
//       console.log("ℹ️ Order already captured:", orderId);
//       return res.json({
//         success: true,
//         id: orderId,
//         status: "COMPLETED",
//         details: { message: "Order already captured" },
//       });
//     }
//     console.error("❌ Capture Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });

// // ✅ Save order after payment (protected) - Enhanced with PayPal capture (FIXED naming conflict)
// router.post("/", verifytoken, async (req, res) => {
//   try {
//     console.log("🔄 Saving order to database...");
//     console.log("👤 User from token:", req.user);
//     console.log("📦 Request body:", JSON.stringify(req.body, null, 2));

//     // ✅ FIXED: Rename 'paypal' to 'paypalData' to avoid shadowing the imported SDK
//     const { items, amount, paypal: paypalData, capturePayment = true } = req.body;

//     // ✅ Enhanced validation: Reject empty items
//     if (!items || !Array.isArray(items) || items.length === 0) {
//       console.error("❌ Invalid or empty items:", items);
//       return res.status(400).json({ error: "Items array is required and cannot be empty" });
//     }

//     if (!amount || isNaN(amount) || amount <= 0) {
//       console.error("❌ Invalid amount:", amount);
//       return res.status(400).json({ error: "Valid positive amount is required" });
//     }

//     if (!req.user || !req.user.id) {
//       console.error("❌ Invalid user from token:", req.user);
//       return res.status(401).json({ error: "Invalid user authentication" });
//     }

//     if (!paypalData?.orderId) {
//       return res.status(400).json({ error: "PayPal order ID is required" });
//     }

//     let captureData = null;
//     if (capturePayment) {
//       // ✅ FIXED: Use imported 'paypal' (SDK), not shadowed variable
//       console.log("💰 Capturing PayPal order:", paypalData.orderId);
//       const captureRequest = new paypal.orders.OrdersCaptureRequest(paypalData.orderId);  // Now 'paypal' is SDK
//       captureRequest.requestBody({});
//       const client = getClient();
//       captureData = await client.execute(captureRequest);

//       console.log("✅ PayPal captured:", { id: captureData.result.id, status: captureData.result.status });

//       if (captureData.result.status !== "COMPLETED") {
//         console.error("❌ Capture status not COMPLETED:", captureData.result.status);
//         return res.status(400).json({ error: "Payment capture failed or incomplete" });
//       }
//     }

//     // Map items (as before, with better fallbacks)
//     const mappedItems = items.map(item => ({
//       name: item.productId?.name || item.name || item.title || 'Unknown Item',  // ✅ Better: Use productId.name if available
//       price: parseFloat(item.productId?.price || item.price) || 0,
//       quantity: parseInt(item.quantity) || 1,
//       productId: item.productId?._id || item.productId || item._id || item.id  // ✅ Handle nested productId
//     }));

//     const newOrder = new Order({
//       user: req.user.id,
//       items: mappedItems,
//       amount: parseFloat(amount),
//       paypal: {
//         orderId: paypalData.orderId,
//         paymentId: captureData?.result.id || null,
//         status: captureData?.result.status || "PENDING",
//         ...(paypalData.raw || {})  // Any extra from frontend
//       },
//       status: "completed",
//       paidAt: new Date(),
//     });

//     console.log("💾 Creating order:", {
//       userId: req.user.id,
//       itemsCount: mappedItems.length,
//       amount: amount,
//       paypalOrderId: paypalData.orderId,
//       captured: !!captureData
//     });

//     const savedOrder = await newOrder.save();
//     console.log("✅ Order saved successfully:", savedOrder._id);

//     res.status(201).json(savedOrder);
//   } catch (err) {
//     console.error("❌ Save order error:", err);

//     // Handle PayPal capture errors specifically
//     if (err.statusCode === 422 && err.message.includes("ORDER_ALREADY_CAPTURED")) {
//       console.log("ℹ️ Order already captured, proceeding to save...");
//       // You could re-call the route without capturePayment, but for now, error out
//       return res.status(400).json({ error: "Payment already processed" });
//     }

//     if (err.name === 'ValidationError') {
//       const validationErrors = Object.values(err.errors).map(e => e.message);
//       return res.status(400).json({ error: "Validation failed", details: validationErrors });
//     }

//     res.status(500).json({ error: err.message, type: err.name });
//   }
// });




// // ✅ Get orders by user (protected) - Enhanced with debugging
// router.get("/myorders", verifytoken, async (req, res) => {
//   try {
//     console.log("🔄 Fetching orders for user:", req.user.id);

//     const orders = await Order.find({ user: req.user.id })
//       .sort({ createdAt: -1 })
//       .populate('user', 'name email') // Optional: populate user details
//       .lean(); // Better performance

//     console.log(`✅ Found ${orders.length} orders for user ${req.user.id}`);

//     res.json(orders);
//   } catch (err) {
//     console.error("❌ Get orders error:", err);
//     res.status(500).json({ error: err.message });
//   }
// });

// // ✅ Debug endpoint to check orders (remove in production)
// router.get("/debug/all-orders", async (req, res) => {
//   try {
//     const allOrders = await Order.find().limit(10).sort({ createdAt: -1 });
//     res.json({
//       totalOrders: await Order.countDocuments(),
//       recentOrders: allOrders
//     });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from "express";
import paypal from "@paypal/checkout-server-sdk";
import getClient from "../Config/paypal.js";
import Order from "../Models/order.js";
import verifytoken from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create PayPal order with proper validation (FULL FIXED VERSION)
router.post("/create-order", async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    // Validation: Check if items exist and not empty
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("❌ Empty or invalid items array:", items);
      return res.status(400).json({
        error: "Cart is empty or invalid items array"
      });
    }

    // ✅ NEW: Validate totalAmount first
    const finalTotal = parseFloat(totalAmount);
    if (isNaN(finalTotal) || finalTotal <= 0) {
      console.error("❌ Invalid totalAmount:", totalAmount);
      return res.status(400).json({
        error: "Invalid total amount (must be positive number)"
      });
    }

    // Calculate items total + Validate each item for NaN/invalid values
    let itemsTotal = 0;
    const paypalItems = [];

    for (let index = 0; index < items.length; index++) {
      const item = items[index];

      // ✅ Extract and validate price/quantity
      const itemPrice = parseFloat(item.price);
      const itemQuantity = parseInt(item.quantity) || 1;  // Default 1 if invalid

      // ✅ CRITICAL: Reject if NaN or invalid
      if (isNaN(itemPrice) || itemPrice <= 0) {
        console.error(`❌ Invalid price at item ${index}:`, {
          name: item.name,
          price: item.price,
          parsed: itemPrice
        });
        return res.status(400).json({
          error: "Invalid item price (must be positive number)",
          details: {
            index,
            name: item.name,
            price: item.price,
            parsedPrice: itemPrice
          }
        });
      }

      if (isNaN(itemQuantity) || itemQuantity <= 0) {
        console.error(`❌ Invalid quantity at item ${index}:`, {
          name: item.name,
          quantity: item.quantity,
          parsed: itemQuantity
        });
        return res.status(400).json({
          error: "Invalid item quantity (must be positive integer)",
          details: {
            index,
            name: item.name,
            quantity: item.quantity,
            parsedQuantity: itemQuantity
          }
        });
      }

      // Calculate item total (safe now)
      const itemTotal = itemPrice * itemQuantity;
      itemsTotal += itemTotal;

      // Build PayPal item object
      paypalItems.push({
        name: (item.name || "Product").substring(0, 127),  // PayPal max 127 chars
        description: (item.description || item.category || "Product").substring(0, 127),
        unit_amount: {
          currency_code: "USD",
          value: itemPrice.toFixed(2)  // String with 2 decimals (safe)
        },
        quantity: itemQuantity.toString(),  // Must be string
        category: "PHYSICAL_GOODS"  // Or "DIGITAL_GOODS" if applicable
      });
    }

    // ✅ Final itemsTotal validation
    itemsTotal = parseFloat(itemsTotal.toFixed(2));
    if (isNaN(itemsTotal) || itemsTotal <= 0) {
      console.error("❌ Calculated itemsTotal is invalid:", itemsTotal);
      return res.status(400).json({
        error: "Invalid calculated total from items"
      });
    }

    // ⚠️ CRITICAL: Validation - amounts must match (with tolerance for rounding)
    if (Math.abs(itemsTotal - finalTotal) > 0.01) {
      console.error('❌ Amount mismatch:', {
        itemsTotal,
        finalTotal,
        difference: Math.abs(itemsTotal - finalTotal),
        items: paypalItems.length
      });
      return res.status(400).json({
        error: "Amount calculation mismatch between items and total",
        details: {
          calculated: itemsTotal,
          sent: finalTotal,
          difference: Math.abs(itemsTotal - finalTotal),
          itemCount: paypalItems.length
        }
      });
    }

    console.log("🔄 Creating PayPal order for USD:", finalTotal);
    console.log("📦 Valid items:", paypalItems.length);
    console.log("💰 Items sample:", paypalItems.slice(0, 2));  // Log first 2 for debug

    // Create PayPal request
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [{
        amount: {
          currency_code: "USD",
          value: finalTotal.toFixed(2),  // Total as string with 2 decimals
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: itemsTotal.toFixed(2)  // Must match items sum exactly
            }
          }
        },
        items: paypalItems,  // Validated items array
        description: `Order of ${items.length} items from Shopping Portal`
      }],
      application_context: {
        brand_name: "Shopping Portal",
        landing_page: "BILLING",
        user_action: "PAY_NOW",
        return_url: `${process.env.CLIENT_URL || "https://shopping-portal-frontend.vercel.app"}/order-success`,  // Fallback if env missing
        cancel_url: `${process.env.CLIENT_URL || "https://shopping-portal-frontend.vercel.app"}/cart`
      }
    });

    // Execute PayPal request
    const client = getClient();
    const order = await client.execute(request);

    console.log("✅ PayPal order created successfully:", order.result.id);
    console.log("💰 Final amount in PayPal:", order.result.purchase_units[0].amount.value);
    console.log("📋 Order status:", order.result.status);

    res.json({
      success: true,
      orderID: order.result.id,
      status: order.result.status,
      links: order.result.links  // Optional: Approval URL etc.
    });

  } catch (err) {
    console.error("❌ PayPal order creation error:", err);
    console.error("Full error object:", JSON.stringify(err, null, 2));
    console.error("Error details:", err.details || "No details");

    // Specific PayPal error handling
    if (err.name === "INVALID_PARAMETER_SYNTAX") {
      return res.status(400).json({
        error: "Invalid PayPal request format",
        details: err.details || [err.message]
      });
    }

    res.status(500).json({
      error: err.message || "Internal server error during PayPal order creation",
      details: err.details || [],
      debug_id: err.debug_id || null  // PayPal debug ID for support
    });
  }
});

// ✅ Capture PayPal order (unchanged)
router.post("/capture-order/:orderId", async (req, res) => {
  const { orderId } = req.params;
  console.log("🔄 Capturing PayPal order:", orderId);

  try {
    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const client = getClient();
    const response = await client.execute(request);

    console.log("✅ PayPal order captured:", {
      id: response.result.id,
      status: response.result.status
    });

    return res.json({
      success: true,
      id: response.result.id,
      status: response.result.status,
      details: response.result,
    });
  } catch (err) {
    if (err.statusCode === 422 && err.message.includes("ORDER_ALREADY_CAPTURED")) {
      console.log("ℹ️ Order already captured:", orderId);
      return res.json({
        success: true,
        id: orderId,
        status: "COMPLETED",
        details: { message: "Order already captured" },
      });
    }
    console.error("❌ Capture Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Save order after payment (protected) - Enhanced with PayPal capture (unchanged)
router.post("/", verifytoken, async (req, res) => {
  try {
    console.log("🔄 Saving order to database...");
    console.log("👤 User from token:", req.user);
    console.log("📦 Request body:", JSON.stringify(req.body, null, 2));

    // ✅ FIXED: Rename 'paypal' to 'paypalData' to avoid shadowing the imported SDK
    const { items, amount, paypal: paypalData, capturePayment = true } = req.body;

    // ✅ Enhanced validation: Reject empty items
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.error("❌ Invalid or empty items:", items);
      return res.status(400).json({ error: "Items array is required and cannot be empty" });
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      console.error("❌ Invalid amount:", amount);
      return res.status(400).json({ error: "Valid positive amount is required" });
    }

    if (!req.user || !req.user.id) {
      console.error("❌ Invalid user from token:", req.user);
      return res.status(401).json({ error: "Invalid user authentication" });
    }

    if (!paypalData?.orderId) {
      return res.status(400).json({ error: "PayPal order ID is required" });
    }

    let captureData = null;
    if (capturePayment) {
      // ✅ FIXED: Use imported 'paypal' (SDK), not shadowed variable
      console.log("💰 Capturing PayPal order:", paypalData.orderId);
      const captureRequest = new paypal.orders.OrdersCaptureRequest(paypalData.orderId);  // Now 'paypal' is SDK
      captureRequest.requestBody({});
      const client = getClient();
      captureData = await client.execute(captureRequest);

      console.log("✅ PayPal captured:", { id: captureData.result.id, status: captureData.result.status });

      if (captureData.result.status !== "COMPLETED") {
        console.error("❌ Capture status not COMPLETED:", captureData.result.status);
        return res.status(400).json({ error: "Payment capture failed or incomplete" });
      }
    }

    // Map items (as before, with better fallbacks)
    const mappedItems = items.map(item => ({
      name: item.productId?.name || item.name || item.title || 'Unknown Item',  // ✅ Better: Use productId.name if available
      price: parseFloat(item.productId?.price || item.price) || 0,
      quantity: parseInt(item.quantity) || 1,
      productId: item.productId?._id || item.productId || item._id || item.id  // ✅ Handle nested productId
    }));

    const newOrder = new Order({
      user: req.user.id,
      items: mappedItems,
      amount: parseFloat(amount),
      paypal: {
        orderId: paypalData.orderId,
        paymentId: captureData?.result.id || null,
        status: captureData?.result.status || "PENDING",
        ...(paypalData.raw || {})  // Any extra from frontend
      },
      status: "completed",
      paidAt: new Date(),
    });

    console.log("💾 Creating order:", {
      userId: req.user.id,
      itemsCount: mappedItems.length,
      amount: amount,
      paypalOrderId: paypalData.orderId,
      captured: !!captureData
    });

    const savedOrder = await newOrder.save();
    console.log("✅ Order saved successfully:", savedOrder._id);

    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("❌ Save order error:", err);

    // Handle PayPal capture errors specifically
    if (err.statusCode === 422 && err.message.includes("ORDER_ALREADY_CAPTURED")) {
      console.log("ℹ️ Order already captured, proceeding to save...");
      // You could re-call the route without capturePayment, but for now, error out
      return res.status(400).json({ error: "Payment already processed" });
    }

    if (err.name === 'ValidationError') {
      const validationErrors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: "Validation failed", details: validationErrors });
    }

    res.status(500).json({ error: err.message, type: err.name });
  }
});

// ✅ Get orders by user (protected) - Enhanced with debugging (unchanged)
router.get("/myorders", verifytoken, async (req, res) => {
  try {
    console.log("🔄 Fetching orders for user:", req.user.id);

    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email') // Optional: populate user details
      .lean(); // Better performance

    console.log(`✅ Found ${orders.length} orders for user ${req.user.id}`);

    res.json(orders);
  } catch (err) {
    console.error("❌ Get orders error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Debug endpoint to check orders (remove in production) (unchanged)
router.get("/debug/all-orders", async (req, res) => {
  try {
    const allOrders = await Order.find().limit(10).sort({ createdAt: -1 });
    res.json({
      totalOrders: await Order.countDocuments(),
      recentOrders: allOrders
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
