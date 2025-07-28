const express = require('express')
const Router = express.Router()
const cart = require('../Models/cart')
const verifytoken = require('../Middleware/authMiddleware')

Router.post("/add", verifytoken, async (req, res) => {
    const { productId, quantity } = req.body
    try {
        const newCartItem = new cart({
            userId: req.user.id,
            productId,
            quantity
        })
        await newCartItem.save()
        res.status(201).json({ message: "Item added to cart" })
    } catch (error) {
        console.log("Add to Cart Error:", error);
        res.status(500).json({ message: "Server error" });
    }
})

Router.get("/", async (req, res) => {
    try {
        const carts = await cart.find()
        res.status(201).json(carts)
    } catch (error) {
        console.log("Fetch carts Error:", error)
        res.status(500).json({ message: "Server error" })
    }
})

Router.delete("/delete/:id", verifytoken, async (req, res) => {
    const { id } = req.params
    try {
        const deleteItem = await cart.findOneAndDelete({
            _id: id, 
            // Kaunsa cart item delete karna hai
            userId: req.user, id
            // Kya ye wahi user hai jo login hai?
        })
        if (!deleteItem) {
            return res.status(404).json({ message: "Item not found or not authorized" });
        }
        res.status(201).json({ message: "Item deleted successfully" })
    } catch (error) {
        console.log("Error, can't delete:", error);
        res.status(500).json({ message: "Server error" });
    }
})

module.exports = Router