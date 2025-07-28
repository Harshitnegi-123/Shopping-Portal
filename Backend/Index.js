const connectDB = require('./Config/DataBase')
const authRoutes = require('./Routes/authRoutes')
const productRoutes = require("./Routes/productRoutes")
const cors = require('cors');
const express = require('express');
const dashboardRoutes = require('./Routes/dashboard')

require("dotenv").config()
connectDB()

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000

app.use("/dashboard", dashboardRoutes)
app.use("/api/products", productRoutes)
app.use("/api/auth", authRoutes)
app.get("/", (req, res) => {
    res.send("🚀 API is working");
});
app.listen(PORT, () => {
    console.log(`server running on http://localhost:${PORT}`)
})