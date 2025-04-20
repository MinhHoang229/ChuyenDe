import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useParams } from 'react-router-dom';
import ProductItem from './ProductItem';

const RelatedProducts = () => {
    const { products } = useContext(ShopContext);
    const { productId } = useParams();

    // Tìm sản phẩm hiện tại
    const currentProduct = products?.find(product => product._id === productId);

    if (!currentProduct) {
        return null;
    }

    // Lọc các sản phẩm liên quan
    const relatedProducts = products?.filter(product => {
        // Loại bỏ sản phẩm hiện tại
        if (product._id === currentProduct._id) return false;
        
        // Kiểm tra cùng category hoặc subCategory
        return (
            product.category === currentProduct.category ||
            product.subCategory === currentProduct.subCategory
        );
    }).slice(0, 4); // Giới hạn 4 sản phẩm

    if (!relatedProducts || relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className='mt-20 px-4 max-w-7xl mx-auto'>
            <h2 className='text-2xl font-semibold mb-8'>Sản phẩm liên quan</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4'>
                {relatedProducts.map((item, index) => (
                    <ProductItem
                        key={index}
                        id={item._id}
                        image={item.images?.[0]}
                        name={item.name}
                        price={item.price}
                    />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;