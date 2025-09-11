import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: String, required: true },
    imgurl: { type: String, required: true, },
    category: { type: String, required: true },
    quantity: { type: Number, default: 10 } // Add quantity field with default value
});

export default mongoose.model("Product", ProductSchema);