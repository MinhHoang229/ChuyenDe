import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Add from './pages/Add'
import List from './pages/List'
import Order from './pages/Order'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  // Protected Route component
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/" replace />
    }
    return children
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      <Routes>
        <Route path="/" element={!token ? <Login setToken={setToken} /> : <Navigate to="/add" replace />} />
        
        <Route path="/add" element={
          <ProtectedRoute>
            <div>
              <Navbar setToken={setToken} />
              <hr />
              <div className='flex w-full'>
                <Sidebar />
                <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-700 text-base'>
                  <Add />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/list" element={
          <ProtectedRoute>
            <div>
              <Navbar setToken={setToken} />
              <hr />
              <div className='flex w-full'>
                <Sidebar />
                <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-700 text-base'>
                  <List />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />

        <Route path="/order" element={
          <ProtectedRoute>
            <div>
              <Navbar setToken={setToken} />
              <hr />
              <div className='flex w-full'>
                <Sidebar />
                <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-700 text-base'>
                  <Order />
                </div>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  )
}

export default App