import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './Models/User.js';
import Product from './Models/Product.js';
import Order from './Models/order.js';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

const addTestData = async () => {
    try {
        // Clear existing data
        await User.deleteMany({});
        await Product.deleteMany({});
        await Order.deleteMany({});

        console.log('Cleared existing data');

        // Create test users
        const user1 = await User.create({
            name: 'John Doe',
            email: 'john@example.com',
            password: 'password123'
        });

        const user2 = await User.create({
            name: 'Jane Smith',
            email: 'jane@example.com',
            password: 'password123'
        });

        console.log('Created test users');

        // Create test products
        const products = await Product.create([
            {
                name: 'Fresh Apples',
                description: 'Sweet and juicy red apples',
                price: '120',
                imgurl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400',
                category: 'Fruits',
                quantity: 50
            },
            {
                name: 'Organic Tomatoes',
                description: 'Fresh organic tomatoes',
                price: '80',
                imgurl: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400',
                category: 'Vegetables',
                quantity: 30
            },
            {
                name: 'Fresh Milk',
                description: 'Pure cow milk',
                price: '60',
                imgurl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=400',
                category: 'Dairy',
                quantity: 5 // Low stock for testing
            },
            {
                name: 'Whole Wheat Bread',
                description: 'Freshly baked bread',
                price: '45',
                imgurl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400',
                category: 'Bakery',
                quantity: 0 // Out of stock for testing
            },
            {
                name: 'Potato Chips',
                description: 'Crunchy potato chips',
                price: '30',
                imgurl: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400',
                category: 'Snacks',
                quantity: 25
            }
        ]);

        console.log('Created test products');

        // Create test orders
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const orders = await Order.create([
            {
                userId: user1._id,
                items: [
                    {
                        productId: products[0]._id,
                        quantity: 2,
                        price: 120
                    },
                    {
                        productId: products[2]._id,
                        quantity: 1,
                        price: 60
                    }
                ],
                amount: 300,
                status: 'delivered',
                paidAt: yesterday
            },
            {
                userId: user2._id,
                items: [
                    {
                        productId: products[1]._id,
                        quantity: 3,
                        price: 80
                    }
                ],
                amount: 240,
                status: 'pending',
                paidAt: today
            },
            {
                userId: user1._id,
                items: [
                    {
                        productId: products[4]._id,
                        quantity: 2,
                        price: 30
                    }
                ],
                amount: 60,
                status: 'processing',
                paidAt: today
            },
            {
                userId: user2._id,
                items: [
                    {
                        productId: products[0]._id,
                        quantity: 1,
                        price: 120
                    },
                    {
                        productId: products[3]._id,
                        quantity: 2,
                        price: 45
                    }
                ],
                amount: 210,
                status: 'shipped',
                paidAt: today
            }
        ]);

        console.log('Created test orders');

        console.log('\n=== Test Data Summary ===');
        console.log(`Users: ${await User.countDocuments()}`);
        console.log(`Products: ${await Product.countDocuments()}`);
        console.log(`Orders: ${await Order.countDocuments()}`);
        console.log(`Orders Today: ${await Order.countDocuments({ createdAt: { $gte: new Date().setHours(0, 0, 0, 0) } })}`);
        console.log(`Active Deliveries: ${await Order.countDocuments({ status: { $in: ['pending', 'processing', 'shipped'] } })}`);

        const totalRevenue = await Order.aggregate([
            { $match: { status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        console.log(`Total Revenue: ₹${totalRevenue[0]?.total || 0}`);

        console.log('\nTest data added successfully!');
        process.exit(0);

    } catch (error) {
        console.error('Error adding test data:', error);
        process.exit(1);
    }
};

addTestData();



