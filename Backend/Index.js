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

// App ko pehle create karo (Yeh main fix!)
const app = express();

// Ab middleware add karo (app ready hai)
app.use(express.json());  // JSON parsing pehle

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow all Vercel preview/production URLs + localhost
        // const allowedPatterns = [
        //     /^https:\/\/shopping-portal-frontend.*\.vercel\.app$/,
        //     /^http:\/\/localhost:\d+$/
        // ];
        const allowedPatterns = [
            /^https:\/\/.*\.vercel\.app$/,
            /^http:\/\/localhost:\d+$/
        ];

        const isAllowed = allowedPatterns.some(pattern => pattern.test(origin));

        if (isAllowed) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Database connect (ab safe, app ready)
connectDB();

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

const PORT = process.env.PORT || 5000;  // Yeh move kiya end mein (optional, use nahi ho raha)

// For Vercel serverless deployment
export default app;
