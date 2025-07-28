const express = require("express")
const Router = express.Router()
const User = require('../Models/User')
const Product = require("../Models/Product")


Router.get('/stats', async (req, res) => {
    try {
        const totalUser = await User.countDocuments()
        const totalProduct = await Product.countDocuments()
        res.json({
            customers: totalUser,
            products: totalProduct
        })
    } catch (error) {
        res.status(500).json({error:"Failed to fetch stats"})
    }
})

module.exports = Router;