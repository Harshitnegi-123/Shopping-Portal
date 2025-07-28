const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    items: [{ productId: String, quantity: Number }],
    status: { type: String, default: "pending" }, // or: "placed", "shipped", "delivered"
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.module("Order", cartSchema)