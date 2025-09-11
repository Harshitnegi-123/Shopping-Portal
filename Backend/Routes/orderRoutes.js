import express from "express";
import paypal from "@paypal/checkout-server-sdk";
import getClient from "../config/paypal.js";

const router = express.Router();

// ✅ Create Order
router.post("/create-order", async (req, res) => {
  const { amount } = req.body; // frontend se USD amount aayega

  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD", // USD force
          value: amount,
        },
      },
    ],
    application_context: {
      return_url: "http://localhost:5173/order-success?source=paypal",
      cancel_url: "http://localhost:5173/cancel",
    },
  });

  try {
    const client = getClient();
    const order = await client.execute(request);
    res.json(order.result);
  } catch (err) {
    console.error("❌ Create order error:", err);
    res.status(500).send({ error: err.message });
  }
});

// ✅ Capture Order
router.post("/capture-order/:orderId", async (req, res) => {
  const { orderId } = req.params;
  try {
    console.log("🔹 Capturing order:", orderId);

    const request = new paypal.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});

    const client = getClient(); // ✅ Fix: use getClient()
    const response = await client.execute(request);
    console.log("✅ Capture response:", response.result);

    return res.json({ success: true, data: response.result });
  } catch (err) {
    // If already captured, don’t block success
    if (err.statusCode === 422 && err.message.includes("ORDER_ALREADY_CAPTURED")) {
      console.log("⚠️ Order already captured, returning success instead.");
      return res.json({ success: true, message: "Order already captured" });
    }

    console.error("❌ Capture Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
