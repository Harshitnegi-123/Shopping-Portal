    import axios from 'axios'
    const api = axios.create({
        baseURL: import.meta.env.VITE_BASE_URL,
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
                { productId,quantity: 1 },
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
            throw error;
        }
    }
    export default api
    export { addToCart };