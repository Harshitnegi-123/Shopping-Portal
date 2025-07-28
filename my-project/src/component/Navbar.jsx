import { div } from "framer-motion/client"
import { Link } from "react-router-dom"

function Navbar() {
    return (
        <div className="bg-yellow-400 text-white">
        <nav className=" flex flex-col sm:flex-row items-center justify-between py-4 px-3 mx-auto max-w-7xl">
            <div className="text-2xl font-black mb-2 sm:mb-0 tracking-wide">
            <Link to="/">Shopping Portal</Link>
            </div>
            <div className="space-x-3 flex flex-col sm:flex-row gap-2 sm:gap-6 tracking-wide">
                <Link to="/" className="hover:underline text-yellow-50 hover:text-white font-medium transition">Home</Link>
                <Link to="/dasboard" className="hover:underline text-yellow-50 hover:text-white font-medium transition">Dashboard</Link>
                <Link to="/cart" className="hover:underline text-yellow-50 hover:text-white font-medium transition">Cart</Link> 
                <Link to="/about" className="hover:underline text-yellow-50 hover:text-white font-medium transition">About</Link> 
            </div>
            <div className="">
                <Link to="/" className="hover:underline border border-yellow-700 rounded-full py-1 px-4 text-yellow-700 bg-white font-semibold hover:bg-yellow-50">Logout</Link>
            </div>
        </nav>
        </div>
    )
}

export default Navbar