import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import AuthPage from './pages/Authpage'
import ProtectedRoute from './component/ProtectedRoute'
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
import Cancleorder from './pages/Cancle'
import Success from './pages/Success'
import Layout from './component/Layout'
import AdminRoute from './component/AdminRoute'
import Navbar from './component/navbar'
import Footer from './component/footer'

function AppContent() {
  const location = useLocation();

  // ✅ agar /admin se start ho raha hai toh navbar+footer mat dikhana
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Auth page without layout */}
        <Route path="/" element={<AuthPage />} />

        {/* All other pages wrapped in Layout */}
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/Fruits" element={<Fruits />} />
          <Route path="/vegetable" element={<Vegetable />} />
          <Route path="/dairy" element={<Dairy />} />
          <Route path="/bakery" element={<Bakery />} />
          <Route path="/snacks" element={<Snacks />} />
          <Route path="/beverage" element={<Beverage />} />
          <Route path='/product/:name' element={<ProductDetails />} />
          <Route path='/admin/dashboard' element={<AdminRoute><Dashboard /></AdminRoute>} />
          <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path='/checkout' element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path='/order-success' element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          <Route path='/cancel' element={<ProtectedRoute><Cancleorder /></ProtectedRoute>} />
          <Route path='/success' element={<ProtectedRoute><Success /></ProtectedRoute>} />
          <Route path='/orders' element={<ProtectedRoute><Order /></ProtectedRoute>} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
