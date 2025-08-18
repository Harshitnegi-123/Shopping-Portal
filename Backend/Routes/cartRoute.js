const express = require('express')
const Router = express.Router()
const cart = require('../Models/cart')
const verifytoken = require('../Middleware/authMiddleware')



Router.post("/add", verifytoken, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cartItem = await cart.findOne({ userId: req.user.id });

        if (cartItem) {
            // Agar cart already exist karta hai
            const itemIndex = cartItem.items.findIndex(item => item.productId.equals(productId));

            if (itemIndex > -1) {
                // Agar product already cart me hai to uski quantity badhao
                cartItem.items[itemIndex].quantity += quantity;
            } else {
                // Naya item push karo
                cartItem.items.push({ productId, quantity });
            }

            await cartItem.save();
            return res.status(200).json({ message: "Item updated in cart" });
        } else {
            // Agar user ka cart hi nhi bana, naya banao
            const newCart = new cart({
                userId: req.user.id,
                items: [{ productId, quantity }]
            });
            await newCart.save();
            return res.status(201).json({ message: "Cart created and item added" });
        }

    } catch (error) {
        console.log("Add to Cart Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});


Router.get("/", verifytoken, async (req, res) => {
    try {
        const carts = await cart.findOne({ userId: req.user.id }).populate('items.productId', 'name price imgurl description')
        // populate ka kaam jo productId me sirf ID thi, usse actual product data se replace kar deta hai.
        // populate('productId', 'name price') → productId wale field me jo objectId store hai, uska name aur price MongoDB se fetch karo.
        res.status(201).json(carts)
    } catch (error) {
        console.log("Fetch carts Error:", error)
        res.status(500).json({ message: "Server error" })
    }
})

Router.delete("/delete/:id", verifytoken, async (req, res) => {
    const { id } = req.params
    try {
        const userCart = await cart.findOne({ userId: req.user.id });
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the item index in the cart
        const itemIndex = userCart.items.findIndex(item => item._id.toString() === id);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Remove the item from the cart
        userCart.items.splice(itemIndex, 1);
        await userCart.save();

        res.status(200).json({ message: "Item deleted successfully" })
    } catch (error) {
        console.log("Error, can't delete:", error);
        res.status(500).json({ message: "Server error" });
    }
})

Router.put("/update/:id", verifytoken, async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    try {
        const userCart = await cart.findOne({ userId: req.user.id });
        if (!userCart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        // Find the item index in the cart
        const itemIndex = userCart.items.findIndex(item => item._id.toString() === id);
        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        // Update the quantity
        userCart.items[itemIndex].quantity = quantity;
        await userCart.save();

        res.status(200).json({ message: "Item quantity updated successfully" });
    } catch (error) {
        console.log("Error updating quantity:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = Router