import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Login = () => {
  const navigate = useNavigate();
  const [currentState, setCurrentState] = useState('Login');
  const [loading, setLoading] = useState(false);
  const { token, setToken, backendUrl ,setUserName} = useContext(ShopContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (currentState === 'Sign Up' && !name) {
      newErrors.name = 'Vui lòng nhập họ tên';
    }
    if (!email) {
      newErrors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    if (!password) {
      newErrors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', {
          name,
          email,
          password
        });
        if (response.data.success) {
          setToken(response.data.token);
          setUserName(response.data.user.name); // ✅ Sử dụng context
          toast.success('Đăng nhập thành công!');
          navigate('/');
        }
         else {
          toast.error(response.data.message || 'Đăng ký thất bại');
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', {
          email,
          password
        });
        if (response.data.success) {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          localStorage.setItem('userName', response.data.user.name);
          toast.success('Đăng nhập thành công!');
          navigate('/');
        } else {
          toast.error(response.data.message || 'Đăng nhập thất bại');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white flex items-center justify-center px-4">
      <div className="bg-white shadow-2xl rounded-2xl w-full max-w-md px-8 py-10">
        <h2 className="text-center text-3xl font-bold text-indigo-600 mb-6 transition-all duration-300">
          {currentState === 'Login' ? 'Chào mừng trở lại' : 'Tạo tài khoản mới'}
        </h2>
        <form onSubmit={onSubmitHandler} className="space-y-5 text-gray-800">
          {currentState === 'Sign Up' && (
            <div>
              <label className="text-sm font-medium">Họ và tên</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                name="name"
                placeholder="Nhập họ tên"
                className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>
          )}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              name="email"
              placeholder="Nhập email"
              className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                errors.email ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-sm font-medium">Mật khẩu</label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              name="password"
              placeholder="••••••••"
              className={`w-full px-4 py-2 mt-1 border rounded-md focus:outline-none focus:ring-2 ${
                errors.password ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-indigo-400'
              }`}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <p className="cursor-pointer hover:underline">Quên mật khẩu?</p>
            <p
              className="cursor-pointer text-indigo-600 hover:underline font-medium"
              onClick={() => {
                setCurrentState(currentState === 'Login' ? 'Sign Up' : 'Login');
                setErrors({});
              }}
            >
              {currentState === 'Login' ? 'Tạo tài khoản' : 'Đăng nhập'}
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Đang xử lý...
              </div>
            ) : (
              currentState === 'Login' ? 'Đăng nhập' : 'Đăng ký'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
