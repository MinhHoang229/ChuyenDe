import React, { useContext, useState, useEffect } from 'react'
import { ShopContext } from '../context/ShopContext'
import Title from './Title'
import ProductItem from './ProductItem'

const BestSeller = () => {
    const { products, loading } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const bestProducts = products.filter((item) => item.bestseller);
            setBestSeller(bestProducts.slice(0, 5));
        }
    }, [products]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'Sản phẩm'} text2='bán chạy nhất' />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>
                    Những sản phẩm bán chạy nhất của chúng tôi
                </p>
            </div>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
                {bestSeller.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item._id}
                        image={item.images[0]}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    );
};

export default BestSeller;