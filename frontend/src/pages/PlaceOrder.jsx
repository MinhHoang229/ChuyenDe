import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { currency, delivery_fee = 0, getCartTotal } = useContext(ShopContext)
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', street: '',
    city: '', state: '', zipcode: '', country: '',
    phone: '', payment: ''
  })

  const subtotal = getCartTotal?.() || 0
  const shipping = subtotal > 0 ? delivery_fee : 0
  const total = subtotal + shipping

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const requiredFields = Object.keys(formData)
    for (let field of requiredFields) {
      if (!formData[field]) {
        toast.error('Vui lòng điền đầy đủ thông tin!')
        return false
      }
    }
    return true
  }

  const handlePlaceOrder = () => {
    if (!validateForm()) return
    toast.success('Đặt hàng thành công!')
    navigate('/orders')
  }

  return (
    <div className='min-h-[90vh] py-12 px-4 md:px-12 flex flex-col lg:flex-row gap-12 bg-gray-50'>
      {/* Left - Delivery Form */}
      <div className='flex-1 space-y-8'>
        <h2 className='text-2xl font-semibold text-gray-800'>Thông tin giao hàng</h2>
        <div className='grid grid-cols-2 gap-4'>
          <input className='input' name='firstName' placeholder='Họ' onChange={handleInputChange} />
          <input className='input' name='lastName' placeholder='Tên' onChange={handleInputChange} />
        </div>
        <input className='input' name='email' type='email' placeholder='Email' onChange={handleInputChange} />
        <input className='input' name='street' placeholder='Địa chỉ' onChange={handleInputChange} />
        <div className='grid grid-cols-2 gap-4'>
          <input className='input' name='city' placeholder='Thành phố' onChange={handleInputChange} />
          <input className='input' name='state' placeholder='Tỉnh/Bang' onChange={handleInputChange} />
        </div>
        <div className='grid grid-cols-2 gap-4'>
          <input className='input' name='zipcode' placeholder='Mã bưu điện' onChange={handleInputChange} />
          <input className='input' name='country' placeholder='Quốc gia' onChange={handleInputChange} />
        </div>
        <input className='input' name='phone' type='tel' placeholder='Số điện thoại' onChange={handleInputChange} />
      </div>

      {/* Right - Order Summary */}
      <div className='w-full lg:w-[400px] space-y-8'>
        <div className='bg-white rounded-xl shadow-md p-6 space-y-4'>
          <h3 className='text-lg font-semibold text-gray-700'>Tổng đơn hàng</h3>
          <div className='flex justify-between text-gray-600'>
            <span>Tạm tính:</span>
            <span>{currency}{subtotal.toFixed(2)}</span>
          </div>
          <div className='flex justify-between text-gray-600'>
            <span>Phí vận chuyển:</span>
            <span>{currency}{shipping.toFixed(2)}</span>
          </div>
          <div className='border-t pt-4 flex justify-between font-medium text-gray-800 text-lg'>
            <span>Tổng cộng:</span>
            <span>{currency}{total.toFixed(2)}</span>
          </div>
        </div>

        <div className='bg-white rounded-xl shadow-md p-6 space-y-4'>
          <h3 className='text-lg font-semibold text-gray-700'>Phương thức thanh toán</h3>
          <label className='flex items-center gap-2'>
            <input type='radio' name='payment' value='cod' onChange={handleInputChange} />
            <span>Thanh toán khi nhận hàng</span>
          </label>
          <label className='flex items-center gap-2'>
            <input type='radio' name='payment' value='card' onChange={handleInputChange} />
            <span>Thẻ tín dụng</span>
          </label>
        </div>

        <button 
          onClick={handlePlaceOrder}
          className='w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg text-lg transition'
        >
          ĐẶT HÀNG
        </button>
      </div>
    </div>
  )
}

export default PlaceOrder
