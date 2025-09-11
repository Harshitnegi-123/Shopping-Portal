import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/Authpage'
import ProtectedRoute from './component/ProtectedRoute'
import './App.css'
import Home from './pages/Home'
import Fruits from './pages/Fruits'
import Vegetable from './pages/Vegetable'
import Dairy from './pages/DairyProduct'
import Bakery from './pages/Bakery'
import Beverage from './pages/Beverage'
import Snacks from './pages/Snacks'
import ProductDetails from './component/ProductDetails'
import Cart from './pages/cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './component/OrderSuccess'
import Order from './component/Order'
import Navbar from './component/Navbar'
import Footer from './component/Footer'
import Breadcrumb from './component/Breadcrumb'
import Cancleorder from './pages/Cancle'
import Success from './pages/Success'

function App() {

  return (
    <>
      <Router>
        <div className="flex flex-col min-h-screen">
          {/* Navbar - Show on all pages except auth */}
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="*" element={<Navbar />} />
          </Routes>

          {/* Breadcrumb - Show on all pages except auth and home */}
          <Routes>
            <Route path="/" element={null} />
            <Route path="/home" element={null} />
            <Route path="*" element={<Breadcrumb />} />
          </Routes>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path='/' element={<AuthPage />} />
              <Route path='/home' element={<Home />} />
              <Route path="/Fruits" element={<Fruits />} />
              <Route path="/vegetable" element={<Vegetable />} />
              <Route path="/dairy" element={<Dairy />} />
              <Route path="/bakery" element={<Bakery />} />
              <Route path="/snacks" element={<Snacks />} />
              <Route path="/beverage" element={<Beverage />} />
              <Route path='/product/:name' element={<ProductDetails />} />
              <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path='/order-success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
              <Route path='/cancel' element={<ProtectedRoute><Cancleorder /></ProtectedRoute>} />
              <Route path='/success' element={<ProtectedRoute><Success /></ProtectedRoute>} />
              <Route path='/orders' element={<ProtectedRoute><Order /></ProtectedRoute>} />
            </Routes>
          </main>

          {/* Footer - Show on all pages except auth */}
          <Routes>
            <Route path="/" element={null} />
            <Route path="*" element={<Footer />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
