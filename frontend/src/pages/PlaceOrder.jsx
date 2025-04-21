import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const PlaceOrder = () => {
  const { cartItems, products, getCartTotal, currency, token, setCartItems, backendUrl } = useContext(ShopContext)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    phone: ''
  })

  const subtotal = getCartTotal()
  const shippingFee = 10000
  const total = subtotal + shippingFee

  const orderProducts = Object.entries(cartItems).map(([productId, sizes]) => {
    const product = products.find(p => p._id === productId)
    return Object.entries(sizes).map(([size, quantity]) => ({
      productId,
      name: product.name,
      price: product.price,
      size,
      quantity,
      image: product.images?.[0]
    }))
  }).flat()

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!token) {
      toast.error('Vui lòng đăng nhập để đặt hàng')
      navigate('/login')
      return
    }

    if (!formData.address || !formData.city || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng')
      return
    }

    try {
      setLoading(true)
      const response = await axios.post(
        `${backendUrl}/api/order/create`,
        {
          products: orderProducts,
          shippingAddress: formData,
          totalAmount: total
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.success) {
        setCartItems({})
        localStorage.removeItem('cartItems')
        
        toast.success('Đặt hàng thành công')
        navigate('/orders')
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng:', error)
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đặt hàng</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form thông tin giao hàng */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-700 mb-2">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập địa chỉ giao hàng"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Thành phố</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập thành phố"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Nhập số điện thoại"
              />
            </div>
          </form>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Thông tin đơn hàng</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              {orderProducts.map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image || 'placeholder.jpg'}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Size: {item.size} x {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {currency}{(item.price * item.quantity).toLocaleString('vi-VN')}
                  </p>
                </div>
              ))}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Tạm tính:</span>
                <span>{currency}{subtotal.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển:</span>
                <span>{currency}{shippingFee.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Tổng cộng:</span>
                <span className="text-indigo-600">
                  {currency}{total.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 text-white font-medium rounded-lg ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-colors`}
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlaceOrder
