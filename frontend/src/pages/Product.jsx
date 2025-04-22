import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { products, loading, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        if (products && productId) {
            const foundProduct = products.find(item => item._id === productId);
            if (foundProduct && foundProduct.images && foundProduct.images.length > 0) {
                setProductData(foundProduct);
                setSelectedImage(foundProduct.images[0]);
                setSelectedSize(null); // Reset size when product changes
                setQuantity(1); // Reset quantity when product changes
            } else {
                setProductData(null);
                setSelectedImage(null);
            }
        }
    }, [products, productId]);

    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error('Vui lòng chọn kích thước');
            return;
        }
        addToCart(productId, selectedSize, quantity);
        toast.success('Đã thêm vào giỏ hàng');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!productData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-gray-500 text-lg mb-4">Không tìm thấy sản phẩm</p>
                <button 
                    onClick={() => navigate('/collection')}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    Quay lại cửa hàng
                </button>
            </div>
        );
    }

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
                {/* Product Images */}
                <div className='space-y-4'>
                    <div className='aspect-w-1 aspect-h-1 w-full'>
                        <img 
                            src={selectedImage || productData.images[0]} 
                            alt={productData.name}
                            className='w-full h-full object-cover rounded-xl'
                        />
                    </div>
                    {productData.images.length > 1 && (
                        <div className='grid grid-cols-4 gap-4'>
                            {productData.images.map((image, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedImage(image)}
                                    className={`aspect-w-1 aspect-h-1 rounded-lg overflow-hidden ${
                                        selectedImage === image ? 'ring-2 ring-indigo-600' : 'hover:opacity-75'
                                    }`}
                                >
                                    <img 
                                        src={image} 
                                        alt={`Product ${index + 1}`}
                                        className='w-full h-full object-cover'
                                    />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className='space-y-6'>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-900'>{productData.name}</h1>
                        <p className='mt-4 text-xl font-semibold text-indigo-600'>
                            {currency} {new Intl.NumberFormat('vi-VN').format(productData.price)}
                        </p>
                    </div>

                    <div>
                        <h3 className='text-sm font-medium text-gray-900'>Mô tả</h3>
                        <p className='mt-2 text-gray-600'>{productData.description}</p>
                    </div>

                    <div>
                        <h3 className='text-sm font-medium text-gray-900 mb-4'>Kích thước</h3>
                        <div className='grid grid-cols-4 gap-4'>
                            {productData.size?.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={`py-2 px-4 text-sm font-medium rounded-md ${
                                        selectedSize === size
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className='text-sm font-medium text-gray-900 mb-4'>Số lượng</h3>
                        <div className='flex items-center space-x-4'>
                            <button
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className='w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50'
                            >
                                -
                            </button>
                            <span className='text-gray-900 font-medium'>{quantity}</span>
                            <button
                                onClick={() => setQuantity(prev => prev + 1)}
                                className='w-10 h-10 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50'
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleAddToCart}
                        className='w-full bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors duration-300 flex items-center justify-center gap-2'
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        Thêm vào giỏ
                    </button>

                    {/* Additional Info */}
                    <div className='pt-6 border-t border-gray-200'>
                        <div className='grid grid-cols-2 gap-4 text-sm'>
                            <div>
                                <p className='text-gray-500'>Danh mục</p>
                                <p className='font-medium text-gray-900'>{productData.category}</p>
                            </div>
                            <div>
                                <p className='text-gray-500'>Loại</p>
                                <p className='font-medium text-gray-900'>{productData.subCategory}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className='mt-20 px-4 max-w-7xl mx-auto'>
                <div className='flex border-b'>
                    <button 
                        className={`px-5 py-3 text-sm ${
                            activeTab === 'description' 
                                ? 'border-b-2 border-black font-semibold' 
                                : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('description')}
                    >
                        Mô tả
                    </button>
                    <button 
                        className={`px-5 py-3 text-sm ${
                            activeTab === 'reviews' 
                                ? 'border-b-2 border-black font-semibold' 
                                : 'text-gray-500'
                        }`}
                        onClick={() => setActiveTab('reviews')}
                    >
                        Đánh giá
                    </button>
                </div>
                <div className='border px-5 py-6 text-sm text-gray-500'>
                    {activeTab === 'description' ? (
                        <div className='space-y-4'>
                            <p>{productData.description}</p>
                        </div>
                    ) : (
                        <div className='space-y-4'>
                            <p>Chưa có đánh giá nào.</p>
                        </div>
                    )}
                </div>
            </div>
            <RelatedProducts/>
        </div>
    );
};

export default Product;
