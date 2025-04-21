import orderModel from '../models/orderModel.js';
import userModel from '../models/userModel.js';

// Tạo đơn hàng mới
export const createOrder = async (req, res) => {
    try {
        const { products, shippingAddress, totalAmount } = req.body;
        const userId = req.user._id;

        // Lấy thông tin user
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy thông tin người dùng"
            });
        }

        // Tạo đơn hàng mới
        const order = await orderModel.create({
            userId,
            userName: user.name,
            products,
            totalAmount,
            shippingAddress
        });

        // Xóa giỏ hàng của user
        user.cartData = {};
        await user.save();

        res.status(201).json({
            success: true,
            message: "Đặt hàng thành công",
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi tạo đơn hàng",
            error: error.message
        });
    }
};

// Lấy danh sách đơn hàng của user
export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 }); // Sắp xếp theo thời gian mới nhất

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: error.message
        });
    }
};

// Admin: Lấy tất cả đơn hàng
export const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: error.message
        });
    }
};

// Admin: Cập nhật trạng thái đơn hàng
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng"
            });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật trạng thái đơn hàng thành công",
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi cập nhật trạng thái đơn hàng",
            error: error.message
        });
    }
};

// Admin: Xóa đơn hàng
export const deleteOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const order = await orderModel.findByIdAndDelete(orderId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng"
            });
        }

        res.status(200).json({
            success: true,
            message: "Xóa đơn hàng thành công"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa đơn hàng",
            error: error.message
        });
    }
};

// Admin: Xóa sản phẩm trong đơn hàng
export const removeProductFromOrder = async (req, res) => {
    try {
        const { orderId, productId } = req.params;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy đơn hàng"
            });
        }

        // Tìm và xóa sản phẩm khỏi mảng products
        const productIndex = order.products.findIndex(p => p._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm trong đơn hàng"
            });
        }

        // Lưu giá trị của sản phẩm để cập nhật tổng tiền
        const removedProduct = order.products[productIndex];
        const removedProductTotal = removedProduct.price * removedProduct.quantity;

        // Xóa sản phẩm khỏi mảng
        order.products.splice(productIndex, 1);

        // Cập nhật tổng tiền
        order.totalAmount -= removedProductTotal;

        // Nếu không còn sản phẩm nào, xóa luôn đơn hàng
        if (order.products.length === 0) {
            await orderModel.findByIdAndDelete(orderId);
            return res.status(200).json({
                success: true,
                message: "Đã xóa sản phẩm cuối cùng và xóa đơn hàng"
            });
        }

        // Lưu đơn hàng đã cập nhật
        await order.save();

        res.status(200).json({
            success: true,
            message: "Xóa sản phẩm khỏi đơn hàng thành công",
            order
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Lỗi khi xóa sản phẩm khỏi đơn hàng",
            error: error.message
        });
    }
}; 