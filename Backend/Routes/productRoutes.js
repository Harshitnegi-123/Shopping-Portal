const express = require("express")
const Router = express.Router()
const Product = require('../Models/Product')
const verifytoken = require('../Middleware/authMiddleware')

Router.post("/add", verifytoken, async (req, res) => {
    console.log("REQ BODY:", req.body);
    const { name, description, price, imgurl, category } = req.body
    try {
        const newProduct = new Product({
            name,
            description,
            price,
            imgurl,
            category,
        })
        await newProduct.save()
        return res.status(201).json({ message: "Product added successfully" })
    } catch (error) {
        console.log("Add product error:", error.message)
        return res.status(500).json({ message: "Server error" })
    }
})


Router.get("/", async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        console.log("Fetch Products Error:", error)
        res.status(500).json({ message: "Server error" })
    }
})

// DELETE a product by ID
Router.delete("/delete/:id", verifytoken, async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.log("Delete Product Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
});

Router.get("/search", async (req, res) => {
    const { query } = req.query
    if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Invalid or missing query string" });
    }
    try {
        const products = await Product.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } }
            ]
        })
        res.status(200).json(products)
    } catch (error) {
        console.log("Search Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }

})


Router.get("/:id", async (req, res) => {
    const { id } = req.params
    // Accessing the ID from URL
    try {
        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.log("Fetch Product by ID Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

// UPDATE product by ID
Router.put("/update/:id", verifytoken, async (req, res) => {
    const { id } = req.params;
    const { name, description, price, imgurl, category } = req.body;

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            { name, description, price, imgurl, category },
            { new: true, runValidators: true }
            // { new: true } → return the updated document (not the old one).

            // runValidators: true → make sure validations from your schema (like required fields) still run during update.
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.log("Update Product Error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// search
Router.get("/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const products = await Product.find({ category: { $regex: new RegExp(category, "i") } });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// routes/products.js
Router.get('/name/:name', async (req, res) => {
    try {
        const product = await Product.findOne({ name: req.params.name });
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



module.exports = Router
