import React, { useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { assets } from '../assets/assets';
import {
    ChevronLeft,
    ChevronRight,
    Home,
    Layers,
    Info,
    Phone,
    ShoppingCart,
    User,
    LogOut
} from 'lucide-react';
import { ShopContext } from '../context/ShopContext';
import { toast } from 'react-toastify';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(true);
    const { getTotalCartItems, token, setToken } = useContext(ShopContext);
    const totalItems = getTotalCartItems();
    
    const handleNavigation = (path) => {
        if (path === '/login' && token) {
            return; // Không cho phép vào trang login nếu đã đăng nhập
        }
        navigate(path);
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
        toast.success('Đã đăng xuất thành công');
        navigate('/');
    };

    const menuClass = (path) =>
        `cursor-pointer p-4 rounded-xl transition-all duration-300 shadow-sm flex items-center gap-3 relative ${
            location.pathname === path 
                ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white'
                : 'hover:bg-indigo-100 text-gray-700 hover:shadow-md bg-white/10 backdrop-blur-md'
        }`;

    const textClass = 'text-base font-semibold tracking-wide';

    return (
        <div className={`fixed left-0 top-0 h-screen bg-gradient-to-b from-white via-indigo-100 to-indigo-200 text-gray-800 shadow-xl z-40 transition-all duration-300 ${isOpen ? 'w-72' : 'w-20'} overflow-hidden`}>

            {/* Logo */}
            <div className="flex items-center justify-center p-4 border-b border-indigo-300 h-[80px]">
                {isOpen && <img src={assets.logo} alt="logo" className="w-40 transition-all duration-300" />}
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-4 px-4 py-6">
                <div onClick={() => handleNavigation('/')} className={menuClass('/')}>
                    <Home size={20} />
                    {isOpen && <p className={textClass}>Trang chủ</p>}
                </div>
                <div onClick={() => handleNavigation('/collection')} className={menuClass('/collection')}>
                    <Layers size={20} />
                    {isOpen && <p className={textClass}>Bộ sưu tập</p>}
                </div>
                <div onClick={() => handleNavigation('/about')} className={menuClass('/about')}>
                    <Info size={20} />
                    {isOpen && <p className={textClass}>Về chúng tôi</p>}
                </div>
                <div onClick={() => handleNavigation('/contact')} className={menuClass('/contact')}>
                    <Phone size={20} />
                    {isOpen && <p className={textClass}>Liên hệ</p>}
                </div>
            </div>

            {/* Bottom Section */}
            <div className="absolute bottom-0 w-full p-4 border-t border-indigo-300 bg-white/20 backdrop-blur-md">
                <div className="flex flex-col gap-4">
                    <div onClick={() => handleNavigation('/cart')} className={menuClass('/cart')}>
                        <ShoppingCart size={20} />
                        {totalItems > 0 && (
                            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                                {totalItems}
                            </span>
                        )}
                        {isOpen && <p className={textClass}>Giỏ hàng</p>}
                    </div>
                    {token ? (
                        <>
                            <div onClick={() => handleNavigation('/orders')} className={menuClass('/orders')}>
                                <User size={20} />
                                {isOpen && <p className={textClass}>Đơn hàng</p>}
                            </div>
                            <div onClick={handleLogout} className={`${menuClass('')} hover:bg-red-100 hover:text-red-600`}>
                                <LogOut size={20} />
                                {isOpen && <p className={textClass}>Đăng xuất</p>}
                            </div>
                        </>
                    ) : (
                        <div onClick={() => handleNavigation('/login')} className={menuClass('/login')}>
                            <User size={20} />
                            {isOpen && <p className={textClass}>Đăng nhập</p>}
                        </div>
                    )}
                </div>
            </div>

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute -right-4 top-1/2 transform -translate-y-1/2 bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-600 transition-all w-10 h-10 flex items-center justify-center z-50"
            >
                {isOpen ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
            </button>
        </div>
    );
};

export default Sidebar;
