import React, { useContext, useState, useEffect } from 'react'
import {ShopContext} from '../context/ShopContext'
import { assets } from '../assets/assets'
import { useLocation, useNavigate } from 'react-router-dom'

const SearchBar = () => {
    const {search, setSearch, showSearch, setShowSearch} = useContext(ShopContext);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        // Tự động focus vào input khi thanh search hiển thị
        if (showSearch) {
            const input = document.querySelector('input[type="text"]');
            if (input) input.focus();
        }
    }, [showSearch]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.trim() !== '') {
            navigate('/collection');
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && search.trim() !== '') {
            navigate('/collection');
        }
    };

    return (
        <div 
            className={`fixed top-[80px] left-0 right-0 bg-white shadow-md z-50 transition-all duration-300 transform ${
                showSearch ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
            }`}
        >
            <div className='max-w-7xl mx-auto px-4 py-3'>
                <div className='flex items-center justify-between'>
                    <div className='flex-1 max-w-2xl'>
                        <div className='relative'>
                            <input 
                                className='w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500' 
                                type='text' 
                                placeholder='Tìm kiếm sản phẩm...'
                                value={search}
                                onChange={handleSearch}
                                onKeyPress={handleKeyPress}
                            />
                            <img 
                                src={assets.search_icon} 
                                alt="search" 
                                className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer' 
                                onClick={() => {
                                    if (search.trim() !== '') {
                                        navigate('/collection');
                                        setShowSearch(false);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <img 
                        onClick={() => {
                            setShowSearch(false);
                            setSearch('');
                        }} 
                        src={assets.cross_icon} 
                        alt="close" 
                        className='w-5 h-5 cursor-pointer ml-4 hover:opacity-70' 
                    />
                </div>
            </div>
        </div>
    )
}

export default SearchBar