import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Product = () => {
    const { productId } = useParams();
    const { products, loading, currency, addToCart } = useContext(ShopContext);
    const [productData, setProductData] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [size, setSize] = useState(null);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        if (products && productId) {
            const foundProduct = products.find(item => item._id === productId);
            if (foundProduct && foundProduct.images && foundProduct.images.length > 0) {
                setProductData(foundProduct);
                setSelectedImage(foundProduct.images[0]);
            } else {
                setProductData(null);
                setSelectedImage(null);
            }
        }
    }, [products, productId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!productData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Không tìm thấy sản phẩm</p>
            </div>
        );
    }

    return (
        <div className='border-t-2 pt-10 transition-opacity duration-500 ease-in opacity-100'>
            <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row max-w-7xl mx-auto px-4'>
                {/* product image */}
                <div className='flex-1'>
                    {productData.images && productData.images.length === 1 ? (
                        <div className='w-full'>
                            <img 
                                src={productData.images[0]} 
                                alt={productData.name} 
                                className='w-full h-auto rounded-lg shadow-md' 
                            />
                        </div>
                    ) : (
                        <div className='flex flex-col-reverse gap-3 sm:flex-row'>
                            <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[15%] w-full'>
                                {productData.images && productData.images.map((item, index) => (
                                    <img 
                                        onClick={() => setSelectedImage(item)} 
                                        src={item} 
                                        key={index}  
                                        className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity rounded-md' 
                                        alt={`Product image ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <div className='w-full sm:w-[85%]'>
                                <img 
                                    src={selectedImage || (productData.images && productData.images[0])} 
                                    alt={productData.name} 
                                    className='w-full h-auto rounded-lg shadow-md' 
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* product info */}
                <div className='flex-1'>
                    <h1 className='font-medium text-2xl text-gray-800'>{productData.name}</h1>

                    <div className='flex items-center gap-1 mt-2'>
                        <img src={assets.star_icon} alt="star" className="w-5" />
                        <img src={assets.star_icon} alt="star" className="w-5" />
                        <img src={assets.star_icon} alt="star" className="w-5" />
                        <img src={assets.star_icon} alt="star" className="w-5" />
                        <img src={assets.star_dull_icon} alt="star" className="w-5" />
                        <p className='pl-2 text-gray-500'>(122)</p>
                    </div>

                    <p className='mt-5 text-3xl font-medium text-indigo-600'>
                        {currency}{productData.price?.toLocaleString('vi-VN')}
                    </p>

                    <p className='mt-5 text-gray-500 md:w-4/5'>{productData.description}</p>

                    <div className='flex flex-col gap-4 my-8'>
                        <p className='font-medium'>Chọn kích thước</p>
                        <div className='flex gap-2 flex-wrap'>
                            {productData.size?.map((item, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => setSize(item)} 
                                    className={`border px-4 py-2 rounded-md transition-all duration-200 shadow-sm 
                                        ${size === item 
                                            ? 'border-2 border-indigo-500 bg-indigo-100 text-indigo-700 font-medium' 
                                            : 'bg-white hover:bg-gray-100'
                                        }`}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>
                        {size && (
                            <p className='text-sm text-indigo-600 mt-2'>Đã chọn: <strong>{size}</strong></p>
                        )}
                    </div>

                    <button 
                        onClick={() => {
                            if (!size) {
                                toast.warning('Vui lòng chọn kích thước!');
                                return;
                            }
                            addToCart(productData._id, size);
                            toast.success('Đã thêm vào giỏ hàng!');
                        }} 
                        className='bg-black text-white px-8 py-3 text-sm hover:bg-gray-800 transition-colors rounded-md'
                    >
                        Thêm vào giỏ hàng
                    </button>

                    <hr className='mt-8 sm:w-3/4 border-gray-200' />

                    <div className='text-sm text-gray-500 mt-5 flex flex-col gap-1'>
                        <p>✓ Sản phẩm chính hãng 100%</p>
                        <p>✓ Thanh toán khi nhận hàng</p>
                        <p>✓ Đổi trả dễ dàng</p>
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
