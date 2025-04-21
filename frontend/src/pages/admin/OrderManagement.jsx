import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderManagement = () => {
    const { token, currency, backendUrl } = useContext(ShopContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOrders();
    }, [token, backendUrl]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(
                `${backendUrl}/api/order/all`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                setOrders(response.data.orders);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
            toast.error('Không thể tải danh sách đơn hàng');
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
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (response.data.success) {
                toast.success('Cập nhật trạng thái đơn hàng thành công');
                fetchOrders(); // Refresh orders list
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật trạng thái:', error);
            toast.error('Không thể cập nhật trạng thái đơn hàng');
        }
    };

    const handleDeleteOrder = async (orderId) => {
        try {
            const response = await axios.delete(`${backendUrl}/api/order/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                toast.success('Xóa đơn hàng thành công');
                fetchOrders(); // Refresh the orders list
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            toast.error('Lỗi khi xóa đơn hàng');
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

    const statusOptions = [
        'Đang xử lý',
        'Đã xác nhận',
        'Đang giao hàng',
        'Đã giao hàng',
        'Đã hủy'
    ];

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center">Đang tải...</div>
            </div>
        );
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
                                <select
                                    value={order.status}
                                    onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} cursor-pointer border-0 focus:ring-2 focus:ring-indigo-500`}
                                >
                                    {statusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
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
                                            {currency}{(item.price * item.quantity).toLocaleString('vi-VN')}
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
                                        {currency}{order.totalAmount.toLocaleString('vi-VN')}
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

export default OrderManagement; 