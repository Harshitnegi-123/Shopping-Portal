import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api"

const Dashboard = () => {
    const [Stats, setStats] = useState(null)

    useEffect(() => {
        const fetchStats = async () => {
            const res = await API.get('/dashboard/stats')
            setStats(res.data)
        }
        fetchStats()
    }, [])


    const navigate = useNavigate()
    useEffect(() => {
        console.log("token in localstorage", localStorage.getItem("token"))
    }, [])

    const Logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        navigate('/')
    }

    return (
        <>
            <div className="min-h-screen flex flex-col text-gray-800">
                <nav className="bg-yellow-300 flex flex-col sm:flex-row justify-between items-center shadow py-3 px-10 ">
                    <div className="text-2xl font-bold tracking-wide">KiranaKart Dashboard</div>
                    <div className="flex gap-4 items-center">
                        <span className="font-medium ">Admin</span>
                        <img
                            src="https://i.pravatar.cc/32"
                            alt="profile"
                            className="rounded-full w-8 h-8"
                        />
                    </div>
                </nav>
                <div className="flex flex-1">
                    <aside className="bg-white w-56 hidden md:block p-6 ">
                        <nav className="flex flex-col gap-4">
                            <a href="#" className="font-semibold text-yellow-600">Dashboard</a>
                            <a href="#" className="text-gray-700 hover:text-yellow-600">Orders</a>
                            <a href="#" className="text-gray-700 hover:text-yellow-600">Products</a>
                            <a href="#" className="text-gray-700 hover:text-yellow-600">Customers</a>
                            <a href="#" className="text-gray-700 hover:text-yellow-600">Reports</a>
                            <a href="#" className="text-gray-700 hover:text-yellow-600">Settings</a>
                        </nav>
                    </aside>
                    {Stats && (
                        <main className="flex-1 p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-7 mb-8">
                                <div className="bg-white p-6 shadow rounded-lg">
                                    <div className="text-sm text-gray-500">orders today</div>
                                    <div className="text-2xl font-bold text-yellow-800">10</div>
                                </div>
                                <div className="bg-white p-6 shadow rounded-lg">
                                    <div className="text-sm text-gray-500">Active Deliveries</div>
                                    <div className="text-2xl font-bold text-yellow-800">30</div>
                                </div>
                                <div className="bg-white p-6 shadow rounded-lg">
                                    <div className="text-sm text-gray-500">Revenue</div>
                                    <div className="text-2xl font-bold text-yellow-800">$5,253</div>
                                </div>
                                <div className="bg-white p-6 shadow rounded-lg">
                                    <div className="text-sm text-gray-500">New Customer</div>
                                    <div className="text-2xl font-bold text-yellow-800">{Stats.customer}</div>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                <section className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                                    <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr>
                                                <th className="py-2">Order ID</th>
                                                <th className="py-2">Customer</th>
                                                <th className="py-2">Status</th>
                                                <th className="py-2">Delivery</th>
                                                <th className="py-2">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-t">
                                                <td className="py-2">#1001</td>
                                                <td className="py-2">Harshit</td>
                                                <td className="py-2 text-green-600">Delivered</td>
                                                <td className="py-2">10:30 AM</td>
                                                <td className="py-2 text-yellow-600 hover:underline cursor-pointer">View</td>
                                            </tr>
                                            <tr className="border-t">
                                                <td className="py-2">#1002</td>
                                                <td className="py-2">jon</td>
                                                <td className="py-2 text-yellow-600">Not Delivered</td>
                                                <td className="py-2">11:39 AM</td>
                                                <td className="py-2 text-yellow-600 hover:underline cursor-pointer">View</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </section>
                                <aside className="flex flex-col gap-6">
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <h3 className="font-semibold mb-2">Sales</h3>
                                        <div className="h-24 justify-center items-center flex text-gray-400">
                                            [chart placeholder]
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <h3 className="font-semibold mb-2">Inventory Alerts</h3>
                                        <ul className="text-sm">
                                            <li className="text-red-600">Tomatoes - Low Stock</li>
                                            <li className="text-red-600">Milk - Out of Stock</li>
                                            <li className="text-yellow-600">Bananas - Reorder Soon</li>
                                        </ul>
                                    </div>
                                </aside>
                            </div>
                        </main>
                    )}
                </div>
            </div>

        </>
    )
}
export default Dashboard



