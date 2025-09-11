import dotenv from 'dotenv';
dotenv.config(); // 💡 This must be the very first thing that runs

import connectDB from './Config/DataBase.js';
import authRoutes from './Routes/authRoutes.js';
import productRoutes from "./Routes/productRoutes.js";
import cors from 'cors';
import express from 'express';
import dashboardRoutes from './Routes/dashboard.js';
import cartRoutes from "./Routes/cartRoute.js";
import orderRoutes from "./Routes/orderRoutes.js";

connectDB();

const app = express();

// app.use((req, res, next) => {
//     res.setHeader(
//         "Content-Security-Policy",
//         [
//             "default-src 'self'",
//             "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.paypal.com https://*.paypalobjects.com https://www.gstatic.com blob:",
//             "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
//             "font-src 'self' https://fonts.gstatic.com",
//             "img-src 'self' data: https://*.paypal.com https://*.paypalobjects.com",
//             "connect-src 'self' https://*.paypal.com https://*.paypalobjects.com",
//             "frame-src 'self' https://*.paypal.com",
//             "form-action 'self' https://*.paypal.com"
//         ].join("; ")
//     );

//     next();
// });

// Middlewares
app.use(cors({ origin: ["http://localhost:5173", "http://localhost:5000"], credentials: true }));
app.use(express.json());
const PORT = process.env.PORT || 5000;

app.use("/dashboard", dashboardRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);

app.get("/", (req, res) => {
    res.send("🚀 API is working");
});

app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`);
});