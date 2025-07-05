const express = require("express")
const Router = express.Router()
const Product = require('../Models/Product')
const verifytoken = require('../Middleware/authMiddleware')

Router.post("/add", verifytoken, async (req, res) => {
    const { name, Description, Price, IMGURL, Category } = req.body
    try {
        const newProduct = new Product({
            name,
            Description,
            Price,
            IMGURL,
            Category,
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
        console.log("Fetch Products Error:", error.message)
        res.status(500).json({ message: "Server error" })
    }
})

module.exports = Router
