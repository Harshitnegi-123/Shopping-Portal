import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

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

// Middlewares
// app.use(cors({
//     origin: ["http://localhost:5173", "http://localhost:5000", "http://localhost:3000"],
//     credentials: true
// }));
app.use(cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers.authorization ? 'Token provided' : 'No token',
        body: req.method === 'POST' ? Object.keys(req.body) : 'N/A'
    });
    next();
});

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
    console.log("working")
    res.json({
        message: "🚀 API is working",
        routes: [
            "POST /api/auth/login",
            "POST /api/auth/signup",
            "POST /api/auth/admin/signup",
            "GET /api/auth/verify",
            "GET /api/dashboard/stats",
            "GET /api/dashboard/analytics",
            "GET /api/dashboard/inventory-alerts"
        ]
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: "Internal Server Error",
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: "Route not found",
        message: `Cannot ${req.method} ${req.originalUrl}`,
        availableRoutes: [
            "POST /api/auth/login",
            "GET /api/dashboard/stats"
        ]
    });
});


app.listen(PORT, () => {
    // console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Dashboard stats available at: http://localhost:${PORT}/api/dashboard/stats`);
    console.log(`🔐 Auth routes available at: http://localhost:${PORT}/api/auth/*`);
});