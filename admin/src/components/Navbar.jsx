import React from 'react'
import { useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'

const Navbar = ({ setToken }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken(null)
    navigate('/')
  }

  return (
    <div className='flex items-center justify-between py-2 px-[4%]'>
      <img className='w-[max(10%,80px)]' src={assets.logo} alt="" />
      <button 
        onClick={handleLogout}
        className='bg-gray-600 text-white px-5 py-2 rounded-full sm:px-7 sm:py-2 text-xs sm:text-sm hover:bg-gray-700'
      >
        Logout
      </button>
    </div>
  )
}

export default Navbar