import React, { createContext, useState, useEffect } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem('cartItems');
        return savedCart ? JSON.parse(savedCart) : {};
    });
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState(() => {
        return localStorage.getItem('token') || null;
    });
    const [currency] = useState('đ');
    const [deliveryFee] = useState(10);
    const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Lưu cartItems vào localStorage mỗi khi có thay đổi
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }, [cartItems]);

    // Lưu token vào localStorage mỗi khi có thay đổi
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products from:', `${backendUrl}/api/product/list`);
                const response = await axios.get(`${backendUrl}/api/product/list`);
                console.log('API Response:', response.data);
                
                if (response.data.success) {
                    setProducts(response.data.products);
                    console.log('Products loaded:', response.data.products);
                } else {
                    console.error('API Error:', response.data.message);
                    toast.error(response.data.message || 'Không thể tải danh sách sản phẩm');
                }
            } catch (error) {
                console.error('Lỗi khi tải sản phẩm:', error);
                if (error.response) {
                    console.error('Server Error:', error.response.data);
                    toast.error(error.response.data.message || 'Lỗi từ server');
                } else if (error.request) {
                    console.error('No response from server');
                    toast.error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
                } else {
                    console.error('Error:', error.message);
                    toast.error('Đã xảy ra lỗi khi tải sản phẩm');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [backendUrl]);

    const addToCart = (itemId, size) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (!newCart[itemId]) {
                newCart[itemId] = {};
            }
            if (!newCart[itemId][size]) {
                newCart[itemId][size] = 1;
            } else {
                newCart[itemId][size] += 1;
            }
            return newCart;
        });
        toast.success('Đã thêm vào giỏ hàng');
    };

    const removeFromCart = (itemId, size) => {
        setCartItems((prev) => {
            const newCart = { ...prev };
            if (newCart[itemId] && newCart[itemId][size]) {
                delete newCart[itemId][size];
                if (Object.keys(newCart[itemId]).length === 0) {
                    delete newCart[itemId];
                }
            }
            return newCart;
        });
    };

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const item in cartItems[items]) {
                if (cartItems[items][item] > 0) {
                    totalCount += cartItems[items][item];
                }
            }
        }
        return totalCount;
    };

    // Get total cart items
    const getTotalCartItems = () => {
        return Object.values(cartItems).reduce((total, sizes) => {
            return total + Object.values(sizes).reduce((sum, qty) => sum + qty, 0);
        }, 0);
    };

    // Get cart total
    const getCartTotal = () => {
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

    const contextValue = {
        products,
        loading,
        currency,
        deliveryFee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartItems,
        getCartTotal,
        getCartCount,
        navigate,
        backendUrl,
        token,
        setToken
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;