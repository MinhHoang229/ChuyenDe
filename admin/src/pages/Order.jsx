import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Order = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const backendUrl = 'http://localhost:4000';
    const token = localStorage.getItem('token');

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/order/all`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            if (error.response?.status === 401) {
                toast.error('Vui lòng đăng nhập để tiếp tục');
                window.location.href = '/login';
            } else {
                toast.error('Không thể tải danh sách đơn hàng');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const response = await axios.put(
                `${backendUrl}/api/order/status/${orderId}`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            if (response.data.success) {
                toast.success('Cập nhật trạng thái thành công');
                fetchOrders();
            }
        } catch (error) {
            console.error('Error updating order status:', error);
            if (error.response?.status === 401) {
                toast.error('Vui lòng đăng nhập để tiếp tục');
                window.location.href = '/login';
            } else {
                toast.error('Không thể cập nhật trạng thái');
            }
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
            try {
                console.log('Deleting order with ID:', orderId);
                
                const response = await axios.delete(
                    `${backendUrl}/api/order/delete/${orderId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    toast.success('Xóa đơn hàng thành công');
                    fetchOrders(); // Refresh the orders list
                }
            } catch (error) {
                console.error('Error deleting order:', error);
                console.error('Error details:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url
                });
                
                if (error.response?.status === 401) {
                    toast.error('Vui lòng đăng nhập để tiếp tục');
                    window.location.href = '/login';
                } else if (error.response?.status === 404) {
                    toast.error('Không tìm thấy đơn hàng hoặc endpoint không tồn tại');
                } else {
                    toast.error('Không thể xóa đơn hàng');
                }
            }
        }
    };

    const handleRemoveProduct = async (orderId, productId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này khỏi đơn hàng?')) {
            try {
                const response = await axios.delete(
                    `${backendUrl}/api/order/${orderId}/product/${productId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data.success) {
                    toast.success(response.data.message);
                    fetchOrders(); // Refresh the orders list
                }
            } catch (error) {
                console.error('Error removing product:', error);
                toast.error('Không thể xóa sản phẩm khỏi đơn hàng');
            }
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang xử lý':
                return 'bg-yellow-100 text-yellow-800';
            case 'Đã xác nhận':
                return 'bg-blue-100 text-blue-800';
            case 'Đang giao hàng':
                return 'bg-purple-100 text-purple-800';
            case 'Đã giao hàng':
                return 'bg-green-100 text-green-800';
            case 'Đã hủy':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="text-center py-8">Đang tải...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6">Quản lý đơn hàng</h1>
            
            {orders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    Chưa có đơn hàng nào
                </div>
            ) : (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Mã đơn hàng: {order._id}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Khách hàng: {order.userName}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} cursor-pointer border-0 focus:ring-2 focus:ring-indigo-500`}
                                    >
                                        <option value="Đang xử lý">Đang xử lý</option>
                                        <option value="Đã xác nhận">Đã xác nhận</option>
                                        <option value="Đang giao hàng">Đang giao hàng</option>
                                        <option value="Đã giao hàng">Đã giao hàng</option>
                                        <option value="Đã hủy">Đã hủy</option>
                                    </select>
                                    <button
                                        onClick={() => handleDeleteOrder(order._id)}
                                        className="p-2 text-red-600 hover:text-red-800 transition-colors"
                                        title="Xóa đơn hàng"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-b py-4 mb-4">
                                {order.products.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={item.image || 'placeholder.jpg'}
                                                alt={item.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    Size: {item.size} x {item.quantity}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-medium">
                                            {item.price.toLocaleString('vi-VN')}đ
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Địa chỉ giao hàng:</span>
                                    <span>{order.shippingAddress.address}, {order.shippingAddress.city}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Số điện thoại:</span>
                                    <span>{order.shippingAddress.phone}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                    <span>Tổng cộng:</span>
                                    <span className="text-indigo-600">
                                        {order.totalAmount.toLocaleString('vi-VN')}đ
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Order;