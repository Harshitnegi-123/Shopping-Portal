import express from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../Models/User.js';
import verifyToken from '../Middleware/authMiddleware.js';

const Router = express.Router();

Router.post('/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user' // Default role is 'user'
        });

        await newUser.save();
        res.status(201).json({role: newUser.role, message: "User registered successfully" });
    } catch (error) {
        console.error("Signup Error:", error.message);
        res.status(500).json({ message: "server error" })
    }
})

Router.post('/login', async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const IsMatch = await bcrypt.compare(password, user.password)
        if (!IsMatch) {
            return res.status(400).json({ message: "Invalid email or password" })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '24h' })
        res.status(200).json({ 
            token, 
            role: user.role, 
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            },
            message: "Login successful" 
        });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

Router.post('/admin/signup', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExist = await User.findOne({ email });
        if (userExist) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new User({ username, email, password: hashedPassword, role: 'admin' });
        await newAdmin.save();
        res.status(201).json({ message: "Admin registered successfully" });
    } catch (error) {
        console.error("Admin Signup Error:", error.message);
        res.status(500).json({ message: "server error" });
    }
})

// Test route to verify token is working
Router.get('/verify', verifyToken, (req, res) => {
    res.json({
        success: true,
        user: {
            id: req.user.id,
            role: req.user.role
        },
        message: "Token is valid"
    });
});

// Add this to your authRoutes.js file

// Test route to check admin user details
Router.get('/admin/test', async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ message: "Email parameter required" });
        }

        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            message: "User found",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                roleType: typeof user.role,
                createdAt: user.createdAt
            }
        });
    } catch (error) {
        console.error("Admin test error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default Router;