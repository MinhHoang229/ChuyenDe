import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const PlaceOrder = () => {
  const {
    cartItems,
    products,
    getCartTotal,
    currency,
    token,
    setCartItems,
    backendUrl
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    phone: '',
    note: ''
  });

  const subtotal = getCartTotal();
  const shippingFee = 10000;
  const total = subtotal + shippingFee;

  const orderProducts = Object.entries(cartItems).map(([productId, sizes]) => {
    const product = products.find((p) => p._id === productId);
    return Object.entries(sizes).map(([size, quantity]) => ({
      productId,
      name: product?.name,
      price: product?.price,
      size,
      quantity,
      image: product?.images?.[0]
    }));
  }).flat();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      toast.error('Vui lòng đăng nhập để đặt hàng');
      navigate('/login');
      return;
    }

    if (!formData.address || !formData.city || !formData.phone) {
      toast.error('Vui lòng điền đầy đủ thông tin giao hàng');
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/order/create`,
        {
          products: orderProducts,
          shippingAddress: {
            address: formData.address,
            city: formData.city,
            phone: formData.phone
          },
          note: formData.note,
          paymentMethod,
          totalAmount: total
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (response.data.success) {
        setCartItems({});
        localStorage.removeItem('cartItems');
        toast.success('Đặt hàng thành công!');
        navigate('/orders');
      }
    } catch (error) {
      console.error('Lỗi đặt hàng:', error);
      toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi đặt hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Đặt hàng</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form thông tin giao hàng */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Thông tin giao hàng</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-1">Địa chỉ</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập địa chỉ"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Thành phố</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập thành phố"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Số điện thoại</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="block text-gray-700 mb-1">Ghi chú cho cửa hàng</label>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleChange}
                className="w-full p-2 border rounded resize-none"
                placeholder="Ví dụ: Giao buổi chiều, gọi trước khi đến..."
                rows={3}
              />
            </div>
          </form>
        </div>

        {/* Chi tiết đơn hàng */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              {orderProducts.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Size: {item.size} x {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-sm font-medium">
                    {currency}{(item.price * item.quantity).toLocaleString('vi-VN')}
                  </span>
                </div>
              ))}
            </div>

            {/* Tổng tiền */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Tạm tính</span>
                <span>{currency}{subtotal.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Phí vận chuyển</span>
                <span>{currency}{shippingFee.toLocaleString('vi-VN')}</span>
              </div>
              <div className="flex justify-between font-semibold text-base border-t pt-2">
                <span>Tổng cộng</span>
                <span className="text-indigo-600">
                  {currency}{total.toLocaleString('vi-VN')}
                </span>
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="pt-4 border-t space-y-2">
              <p className="font-medium text-gray-700">Phương thức thanh toán</p>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                  />
                  Thanh toán khi nhận hàng
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                  />
                  Thẻ tín dụng
                </label>
              </div>
            </div>

            {/* Button đặt hàng */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full py-3 text-white font-medium rounded-lg mt-4 ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              } transition-all`}
            >
              {loading ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
