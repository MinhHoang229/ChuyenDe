import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault()
      const response = await axios.post('http://localhost:4000/api/user/admin', {email, password})
      
      if (response.data.success) {
        localStorage.setItem('token', response.data.token)
        setToken(response.data.token)
        toast.success('Login successful!')
        navigate('/add')
      } else {
        setError(response.data.message || 'Login failed')
        toast.error(response.data.message || 'Login failed')
      }
    } catch (error) {
      console.log(error)
      const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-md px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-4'>Admin Login</h1>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={onSubmitHandler}>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
            <input 
              onChange={(e) => setEmail(e.target.value)} 
              value={email} 
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500' 
              type="email" 
              placeholder='your@email.com' 
              required 
            />
          </div>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className='rounded-md w-full px-3 py-2 border border-gray-300 outline-none focus:border-blue-500' 
              type="password" 
              placeholder='Enter Your Password' 
              required 
            />
          </div>
          <button 
            className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black hover:bg-gray-800 transition-colors' 
            type='submit'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
