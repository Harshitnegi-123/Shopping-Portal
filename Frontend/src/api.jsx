import axios from 'axios'
const api = axios.create({
    // baseURL: import.meta.env.VITE_API_URL
    baseURL: 'http://localhost:5000',
    headers: {
        "Content-Type": "application/json"
    }
});

const addToCart = async (productId) => {
    try {
        const token = localStorage.getItem('token')
        if (!token) {
            console.error("No token found, please login")
            return
        }
        const response = await api.post(
            '/api/cart/add',
            { productId },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        console.log("Product added to cart:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error adding to cart:", error.response?.data || error.message);
    }
}
export default api
export { addToCart };