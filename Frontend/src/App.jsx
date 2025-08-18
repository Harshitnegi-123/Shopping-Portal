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

function App() {

  return (
    <>
      <Router>
        <Routes>
          {/* <Route path="/" element={<Home />} /> */}
          <Route path='/' element={<AuthPage />} />
          <Route path='/home' element={<Home />} />
          <Route path="/Fruits" element={<Fruits />} />
          <Route path="/vegetable" element={<Vegetable />} />
          <Route path="/dairy" element={<Dairy/>} />
          <Route path="/bakery" element={<Bakery/>} />
          <Route path="/snacks" element={<Snacks/>} />
          <Route path="/beverage" element={<Beverage/>} />
          <Route path='/product/:name' element={<ProductDetails />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
