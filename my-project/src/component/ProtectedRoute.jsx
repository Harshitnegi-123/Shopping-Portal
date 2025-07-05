import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" replace />;
        // replace ka matlab: history me back press karke wapas dashboard na ja sake.
    }

    return children;
};

export default ProtectedRoute;
    