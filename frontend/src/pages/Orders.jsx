import React, { useContext } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'

const Orders = () => {
    const { products, currency, cartItems } = useContext(ShopContext);

    // Chuyển đổi cartItems thành mảng orders
    const orders = Object.entries(cartItems).map(([productId, sizes]) => {
        const product = products.find(p => p._id === productId);
        if (!product) return null;

        return Object.entries(sizes).map(([size, quantity]) => ({
            id: productId,
            name: product.name,
            price: product.price,
            image: product.image?.[0] || 'https://via.placeholder.com/300x300?text=No+Image',
            size: size,
            quantity: quantity,
            totalPrice: product.price * quantity
        }));
    }).flat().filter(Boolean);

    if (orders.length === 0) {
        return (
            <div className='border-t pt-14'>
                <div className='text-2xl mb-3'>
                    <Title text1={'Đơn'} text2={'Hàng'} />
                </div>
                <div className='text-center py-10'>
                    <p className='text-gray-500'>Bạn chưa có đơn hàng nào</p>
                </div>
            </div>
        );
    }

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text1={'Đơn'} text2={'Hàng'} />
            </div>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='space-y-4'>
                    {orders.map((order, index) => (
                        <div key={index} className='border rounded-lg p-4 hover:shadow-md transition-shadow'>
                            <div className='flex items-start gap-6'>
                                <div className='relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded'>
                                    <img 
                                        src={order.image} 
                                        alt={order.name}
                                        className='w-full h-full object-cover'
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div className='flex-1'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h3 className='font-medium text-lg'>{order.name}</h3>
                                            <div className='mt-1 space-y-1 text-sm text-gray-500'>
                                                <p>Size: {order.size}</p>
                                                <p>Số lượng: {order.quantity}</p>
                                                <p>Đơn giá: {currency}{order.price.toLocaleString('vi-VN')}</p>
                                            </div>
                                        </div>
                                        <div className='text-right'>
                                            <p className='text-lg font-medium text-indigo-600'>
                                                {currency}{order.totalPrice.toLocaleString('vi-VN')}
                                            </p>
                                            <p className='mt-1 text-sm text-green-600'>Đang xử lý</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Orders