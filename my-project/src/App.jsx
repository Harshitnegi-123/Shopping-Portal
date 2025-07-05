import { useState } from 'react'
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom'
import SignUp from './pages/signup'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ProtectedRoute from './component/ProtectedRoute'
import './App.css'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path='/login' element={<Login/>}/>
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/></Routes>
      </Router>
    </>
  )
}

export default App
