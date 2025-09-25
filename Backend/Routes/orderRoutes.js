import express from "express";
import paypal from "@paypal/checkout-server-sdk";
import getClient from "../config/paypal.js";
import Order from "../models/Order.js";
import verifytoken from "../Middleware/authMiddleware.js";

const router = express.Router();

// ✅ Create PayPal order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body;
  console.log("🔄 Creating PayPal order for amount:", amount);

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: amount,
        },
      },
    ],
    application_context: {
      return_url: "http://localhost:5173/order-success",
      cancel_url: "http://localhost:5173/cancel",
    },
  });

  try {
    const client = getClient();
    const order = await client.execute(request);
    console.log("✅ PayPal order created:", order.result.id);
    res.json(order.result);
  } catch (err) {
    console.error("❌ Create order error:", err);
    res.status(500).send({ error: err.message });
  }
});

// ✅ Capture PayPal order
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

// ✅ Save order after payment (protected) - Enhanced with PayPal capture (FIXED naming conflict)
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




// ✅ Get orders by user (protected) - Enhanced with debugging
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

// ✅ Debug endpoint to check orders (remove in production)
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
