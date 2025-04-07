import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <nav className="bg-purple-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="text-2xl font-bold">Soccer League</div>
      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-300">Home</Link>
        <Link to="/teams" className="hover:text-gray-300">Teams</Link>
        <Link to="/booking" className="hover:text-gray-300">Booking</Link>
        <Link to="/committee" className="hover:text-gray-300">Committee</Link>
        <Link to="/signin" className="hover:text-gray-300">Sign In</Link>
        <Link to="/signup" className="hover:text-gray-300">Sign Up</Link>
      </div>
    </nav>
  )
}

export default NavBar