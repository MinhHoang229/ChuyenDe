import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from '../components/Title'
import CartTotal from '../components/CartTotal'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useNavigate } from 'react-router-dom'

const Cart = () => {
    const { products, currency, cartItems, removeFromCart, setCartItems, token } = useContext(ShopContext);
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

    

    if (cartProducts.length === 0) {
        return (
            <div className='border-t pt-14'>
                <div className='text-2xl mb-3'>
                    <Title text={'Giỏ'} text2={'Hàng'} />
                </div>
                <div className='text-center py-10'>
                    <p className='text-gray-500'>Giỏ hàng của bạn đang trống</p>
                </div>
            </div>
        );
    }

    return (
        <div className='border-t pt-14'>
            <div className='text-2xl mb-3'>
                <Title text={'Giỏ'} text2={'Hàng'} />
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8'>
                <div className='space-y-4'>
                    {cartProducts.map((item, index) => (
                        <div key={index} className='py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4'>
                            <div className='flex items-start gap-6'>
                                <div className='relative w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded'>
                                    <img 
                                        src={item.image} 
                                        alt={item.name}
                                        className='w-full h-full object-cover'
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                                        }}
                                    />
                                </div>
                                <div>
                                    <p className='text-xs sm:text-lg font-medium'>{item.name}</p>
                                    <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-5 mt-2'>
                                        <p className='font-medium'>{currency}{item.price.toLocaleString('vi-VN')}</p>
                                        <p className='px-2 sm:px-3 sm:py-1 border bg-slate-50 rounded-full'>
                                            Size: {item.size}
                                        </p>
                                        <p className='text-indigo-600 font-medium'>
                                            Tổng: {currency}{item.totalPrice.toLocaleString('vi-VN')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <button 
                                    className='w-6 h-6 flex items-center justify-center border rounded-full hover:bg-gray-100'
                                    onClick={() => handleQuantityChange(item.id, item.size, item.quantity - 1)}
                                >
                                    -
                                </button>
                                <input 
                                    type='number'
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(item.id, item.size, parseInt(e.target.value))}
                                    className='border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1 text-center'
                                />
                                <button 
                                    className='w-6 h-6 flex items-center justify-center border rounded-full hover:bg-gray-100'
                                    onClick={() => handleQuantityChange(item.id, item.size, item.quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <button 
                                onClick={() => {
                                    removeFromCart(item.id, item.size);
                                    toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
                                }}
                                className='w-4 sm:w-6 h-4 sm:h-6 flex items-center justify-center hover:bg-red-100 rounded-full transition-colors'
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>

                <div className='space-y-6'>
                    <CartTotal />
                    
                </div>
            </div>
        </div>
    );
};

export default Cart;
