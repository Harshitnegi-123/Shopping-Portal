const express = require("express")
const Router = express.Router()
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')
const User = require('../Models/User')
const verifyToken = require('../Middleware/authMiddleware')

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
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
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

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        res.status(200).json({ token, message: "Login successful" });
    } catch (error) {
        console.error("Login Error:", error.message);
        res.status(500).json({ message: "Server error" });
    }
})

Router.get('/dashboard', verifyToken, (req, res) => {
    res.json({
        message: `Welcome, your user ID is: ${req.user.id}`
    })
})

module.exports = Router;