import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    const { products, currency, cartItems, removeFromCart, setCartItems, token, deliveryFee } = useContext(ShopContext);
    const [cartProducts, setCartProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const updatedCartProducts = [];
        Object.entries(cartItems).forEach(([productId, sizes]) => {
            const product = products.find(p => p._id === productId);
            if (product) {
                Object.entries(sizes).forEach(([size, quantity]) => {
                    updatedCartProducts.push({
                        id: productId,
                        name: product.name,
                        price: product.price,
                        image: product.images?.[0] || 'https://via.placeholder.com/300x300?text=No+Image',
                        size: size,
                        quantity: quantity,
                        totalPrice: product.price * quantity
                    });
                });
            }
        });
        setCartProducts(updatedCartProducts);
    }, [cartItems, products]);

    const handleQuantityChange = (productId, size, newQuantity) => {
        if (newQuantity < 1) {
            removeFromCart(productId, size);
            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
            return;
        }

        setCartItems(prev => {
            const newCart = { ...prev };
            if (!newCart[productId]) newCart[productId] = {};
            newCart[productId][size] = newQuantity;
            return newCart;
        });
        toast.success('Đã cập nhật số lượng');
    };

    const getTotalCartAmount = () => {
        let total = 0;
        Object.entries(cartItems).forEach(([productId, sizes]) => {
            const product = products.find(p => p._id === productId);
            if (product) {
                Object.entries(sizes).forEach(([size, quantity]) => {
                    total += product.price * quantity;
                });
            }
        });
        return total;
    };

    if (cartProducts.length === 0) {
        return (
            <div className='border-t pt-14'>
                <div className='text-2xl mb-3'>
                    <Title text1={'Giỏ'} text2={'Hàng'} />
                </div>
                <div className='text-center py-10'>
                    <p className='text-gray-500'>Giỏ hàng của bạn đang trống</p>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='text-3xl font-bold text-gray-900 mb-8'>
                <Title text={'Giỏ'} text2={'Hàng'} />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12'>
                <div className='space-y-6'>
                    {cartProducts.map((item, index) => (
                        <div key={index} className='bg-white rounded-xl shadow-sm p-6 flex flex-col sm:flex-row items-start gap-6'>
                            <div className='relative w-full sm:w-32 h-32 overflow-hidden rounded-lg'>
                                <img 
                                    src={item.image} 
                                    alt={item.name}
                                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-300'
                                    onError={(e) => {
                                        e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                    }}
                                />
                            </div>
                            <div className='flex-1 space-y-4'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h3 className='text-lg font-semibold text-gray-900'>{item.name}</h3>
                                        <div className='mt-2 space-x-3'>
                                            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800'>
                                                Size: {item.size}
                                            </span>
                                            <span className='text-lg font-bold text-indigo-600'>
                                                {currency} {new Intl.NumberFormat('vi-VN').format(item.price)}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            removeFromCart(item.id, item.size);
                                            toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
                                        }}
                                        className='text-gray-400 hover:text-red-500 transition-colors'
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <div className='flex items-center border border-gray-200 rounded-lg'>
                                        <button 
                                            className='w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50'
                                            onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                                        >
                                            -
                                        </button>
                                        <input 
                                            type='number'
                                            min={1}
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item.id, item.size, parseInt(e.target.value))}
                                            className='w-16 h-10 border-x border-gray-200 text-center focus:outline-none'
                                        />
                                        <button 
                                            className='w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50'
                                            onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                    <p className='text-lg font-bold text-indigo-600'>
                                        Tổng: {currency} {new Intl.NumberFormat('vi-VN').format(item.totalPrice)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className='bg-white rounded-xl shadow-sm p-6 h-fit space-y-6'>
                    <h2 className='text-xl font-bold text-gray-900 pb-4 border-b'>Tổng đơn hàng</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Tổng tiền hàng:</span>
                            <span className="text-lg font-medium">{currency} {new Intl.NumberFormat('vi-VN').format(getTotalCartAmount())}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Phí vận chuyển:</span>
                            <span className="text-lg font-medium">{currency} {new Intl.NumberFormat('vi-VN').format(deliveryFee)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t">
                            <span className="text-lg font-bold">Tổng cộng:</span>
                            <span className="text-xl font-bold text-indigo-600">
                                {currency} {new Intl.NumberFormat('vi-VN').format(getTotalCartAmount() + deliveryFee)}
                            </span>
                        </div>
                    </div>
                    <button 
                        className='w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium'
                        onClick={() => navigate('/place-order')}
                    >
                        Tiến hành thanh toán
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Cart;
