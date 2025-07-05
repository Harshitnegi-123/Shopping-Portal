const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Description: { type: String, required: true },
    Price: { type: Number, required: true },
    IMGURL: { type: String, required: true, unique: true },
    Category: { type: String, required: true }
})

module.exports = mongoose.model("Product", ProductSchema)