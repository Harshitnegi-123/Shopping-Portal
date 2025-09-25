import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    // If no token or not admin, redirect appropriately
    if (!token) {
        return <Navigate to="/" replace />;
    }
    
    if (role !== "admin") {
        return <Navigate to="/home" replace />;
    }

    return children;
};

export default AdminRoute;