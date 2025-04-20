import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const backendUrl = "http://localhost:4000";

const List = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  const removeProduct = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Bạn cần đăng nhập lại!');
        return;
      }

      const response = await axios.delete(`${backendUrl}/api/product/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        toast.success('Xóa sản phẩm thành công!');
        setProducts(prev => prev.filter(product => product._id !== id));
      } else {
        toast.error(response.data.message || 'Xóa sản phẩm thất bại!');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!');
      } else if (error.response?.status === 404) {
        toast.error('Không tìm thấy sản phẩm này!');
        setProducts(prev => prev.filter(product => product._id !== id));
      } else {
        toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi xóa sản phẩm!');
      }
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Bạn cần đăng nhập lại!');
        return;
      }

      const response = await axios.get(`${backendUrl}/api/product/list`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message || 'Không thể tải danh sách sản phẩm!');
      }
    } catch (error) {
      toast.error('Không thể tải danh sách sản phẩm!');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Danh sách sản phẩm</h1>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-[100px_2fr_1fr_1fr_1fr_100px] gap-4 p-4 bg-gray-50 border-b">
          <div className="font-semibold">Hình ảnh</div>
          <div className="font-semibold">Tên sản phẩm</div>
          <div className="font-semibold">Giá</div>
          <div className="font-semibold">Danh mục</div>
          <div className="font-semibold">Kích cỡ</div>
          <div className="font-semibold text-center">Thao tác</div>
        </div>

        <div className="divide-y">
          {products.map((product) => (
            <div key={product._id} className="grid grid-cols-[100px_2fr_1fr_1fr_1fr_100px] gap-4 p-4 items-center hover:bg-gray-50">
              <div className="w-16 h-16">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="min-w-0">
                <div className="font-medium truncate">{product.name}</div>
                <div
                  className="text-sm text-gray-500 overflow-hidden text-ellipsis"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical'
                  }}
                  title={product.description}
                >
                  {product.description}
                </div>
                {product.bestseller && (
                  <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded">
                    Bestseller
                  </span>
                )}
              </div>
              <div className="truncate">${product.price}</div>
              <div className="truncate">{product.category}</div>
              <div className="flex gap-1 flex-wrap">
                {product.size.map((size) => (
                  <span key={size} className="px-2 py-1 text-xs bg-gray-100 rounded">
                    {size}
                  </span>
                ))}
              </div>
              <div className="flex justify-center shrink-0">
                <button
                  onClick={() => removeProduct(product._id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                  title="Xóa sản phẩm"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {products.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          Chưa có sản phẩm nào
        </div>
      )}
    </div>
  );
};

export default List;
