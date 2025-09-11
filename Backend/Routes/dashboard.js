import express from "express";
import User from "../Models/User.js";
import Product from "../Models/Product.js";
import Order from "../Models/order.js";
import verifytoken from "../Middleware/authMiddleware.js";

const router = express.Router();

// Apply authentication middleware to all dashboard routes
router.use(verifytoken);

// Get comprehensive dashboard stats
router.get('/stats', async (req, res) => {
    try {
        // Basic counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // Today's orders
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        // Active deliveries (orders with pending status)
        const activeDeliveries = await Order.countDocuments({
            status: { $in: ['pending', 'processing', 'shipped'] }
        });

        // Total revenue
        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        // Recent orders (last 10)
        const recentOrders = await Order.find()
            .populate('userId', 'name email')
            .populate('items.productId', 'name price')
            .sort({ createdAt: -1 })
            .limit(10)
            .select('_id userId items amount status createdAt');

        // Low stock products (less than 10 quantity)
        const lowStockProducts = await Product.find({ quantity: { $lt: 10 } })
            .select('name quantity price')
            .limit(5);

        // Revenue by status
        const revenueByStatus = await Order.aggregate([
            { $group: { _id: '$status', total: { $sum: '$amount' } } }
        ]);

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        res.json({
            customers: totalUsers,
            products: totalProducts,
            totalOrders,
            ordersToday,
            activeDeliveries,
            totalRevenue: totalRevenue[0]?.total || 0,
            recentOrders,
            lowStockProducts,
            revenueByStatus,
            ordersByStatus
        });
    } catch (error) {
        console.error('Dashboard stats error:', error);
        res.status(500).json({ error: "Failed to fetch dashboard stats" });
    }
});

// Get detailed order analytics
router.get('/analytics', async (req, res) => {
    try {
        const { period = '7d' } = req.query;

        let startDate = new Date();
        switch (period) {
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            case '90d':
                startDate.setDate(startDate.getDate() - 90);
                break;
            default:
                startDate.setDate(startDate.getDate() - 7);
        }

        // Revenue trend
        const revenueTrend = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate }, status: { $ne: 'cancelled' } } },
            { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: '$amount' } } },
            { $sort: { _id: 1 } }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.productId', totalQuantity: { $sum: '$items.quantity' }, totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
            { $unwind: '$product' }
        ]);

        res.json({
            revenueTrend,
            topProducts
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
});

// Get inventory alerts
router.get('/inventory-alerts', async (req, res) => {
    try {
        const outOfStock = await Product.find({ quantity: 0 }).select('name quantity price');
        const lowStock = await Product.find({ quantity: { $gt: 0, $lt: 10 } }).select('name quantity price');

        res.json({
            outOfStock,
            lowStock
        });
    } catch (error) {
        console.error('Inventory alerts error:', error);
        res.status(500).json({ error: "Failed to fetch inventory alerts" });
    }
});

export default router;
