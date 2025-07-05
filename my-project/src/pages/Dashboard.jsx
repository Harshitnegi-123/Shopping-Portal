import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const Dashboard = () => {
    const navigate = useNavigate()
    useEffect(() => {
        console.log("token in localstorage", localStorage.getItem("token"))
    }, [])

    const Logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        navigate('/login')
    }

    return (
        <>
            <form>  
                <h1>dashboard</h1>
                <button type="submit" onClick={Logout}>logout</button>
            </form>

        </>
    )
}
export default Dashboard

