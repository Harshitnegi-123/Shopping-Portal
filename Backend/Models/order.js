import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    }
  ],
  amount: { type: Number, required: true },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  status: { type: String, default: "pending" },
  paidAt: Date,
}, { timestamps: true });

export default mongoose.model("Order", orderSchema);
