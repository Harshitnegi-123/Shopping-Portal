import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            // type: mongoose.Schema.Types.ObjectId: Ye MongoDB ka special type hai jisse relation banta hai.
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, default: 1, min: 1 }
        }
    ]
});

export default mongoose.model("Cart", cartSchema);
