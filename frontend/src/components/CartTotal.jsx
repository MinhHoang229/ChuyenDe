import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const CartTotal = () => {
    const { getCartTotal, currency, token } = useContext(ShopContext);
    const navigate = useNavigate();
    const total = getCartTotal();

    const handleCheckout = () => {
        if (!token) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            navigate('/login');
            return;
        }
        navigate('/place-order');
    };

    return (
        <div className='bg-white p-6 rounded-lg shadow-md space-y-4'>
            <h3 className='text-xl font-semibold text-gray-800'>Tổng đơn hàng</h3>
            <div className='space-y-2'>
                <div className='flex justify-between text-gray-600'>
                    <span>Tạm tính:</span>
                    <span>{currency}{total.toLocaleString('vi-VN')}</span>
                </div>
                <div className='flex justify-between text-gray-600'>
                    <span>Phí vận chuyển:</span>
                    <span>{currency}10.000</span>
                </div>
                <div className='border-t pt-2'>
                    <div className='flex justify-between font-semibold text-lg'>
                        <span>Tổng cộng:</span>
                        <span className='text-indigo-600'>{currency}{(total + 10000).toLocaleString('vi-VN')}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={handleCheckout}
                className='w-full bg-indigo-600 text-white font-semibold py-3 rounded-md hover:bg-indigo-700 transition-colors duration-300'
            >
                {token ? 'Thanh toán' : 'Đăng nhập để thanh toán'}
            </button>
        </div>
    );
};

export default CartTotal;