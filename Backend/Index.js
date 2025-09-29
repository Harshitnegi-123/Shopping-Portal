import dotenv from 'dotenv';
dotenv.config();

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

// CORS Configuration - Vercel ke liye updated
app.use(cors({
    origin: [
        "https://shopping-portal-frontend-3zsxyu0t3.vercel.app", // actual frontend domain
        "http://localhost:5173"
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const PORT = process.env.PORT || 5000;

// Debug middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`, {
        headers: req.headers.authorization ? 'Token provided' : 'No token',
        body: req.method === 'POST' ? Object.keys(req.body) : 'N/A'
    });
    next();
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({
        message: "🚀 API is working",
        status: "active",
        routes: [
            "POST /api/auth/login",
            "POST /api/auth/signup",
            "POST /api/auth/admin/signup",
            "GET /api/auth/verify",
            "GET /api/products",
            "GET /api/cart",
            "POST /api/order",
            "GET /api/dashboard/stats"
        ]
    });
});

// Route mounting
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);

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
        message: `Cannot ${req.method} ${req.originalUrl}`
    });
});

// For Vercel serverless deployment
export default app;