import React, { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';

const ProductItem = ({ id, name, image, price }) => {
  const { addToCart, currency } = useContext(ShopContext);
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(id);
  };

  return (
    <div
      onClick={() => navigate(`/product/${id}`)}
      className="group bg-white rounded-2xl overflow-hidden shadow hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col"
    >
      {/* Product Image */}
      <div className="relative overflow-hidden aspect-square">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Product Details */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2 mb-2">
          {name}
        </h3>
        <div className="mt-auto flex flex-col gap-4">
          <p className="text-lg font-bold text-indigo-600">
            {currency} {new Intl.NumberFormat('vi-VN').format(price)}
          </p>
          <button
            onClick={handleAddToCart}
            className="w-full py-2.5 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition duration-300 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Thêm vào giỏ
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
