import { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Add = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subCategory: '',
    size: [],
    bestseller: false,
    images: []
  });

  const [previewImages, setPreviewImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size]
    }));
  };

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...previewImages];
        newPreviews[index] = reader.result;
        setPreviewImages(newPreviews);
      };
      reader.readAsDataURL(file);

      // Update form data
      const newImages = [...formData.images];
      newImages[index] = file;
      setFormData({ ...formData, images: newImages });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('subCategory', formData.subCategory);
      data.append('size', JSON.stringify(formData.size));
      data.append('bestseller', formData.bestseller);
      
      formData.images.forEach((image, index) => {
        if (image) {
          data.append(`image${index + 1}`, image);
        }
      });

      const response = await axios.post('http://localhost:4000/api/product/add', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.data.success) {
        toast.success('Thêm sản phẩm thành công!');
        // Reset form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          subCategory: '',
          size: [],
          bestseller: false,
          images: []
        });
        setPreviewImages([null, null, null, null]);
        // Chuyển hướng về trang danh sách sản phẩm
        navigate('/list');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Thêm sản phẩm thất bại');
    } finally {
      setLoading(false);
    }
  };

  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Giá</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Danh mục</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Chọn danh mục</option>
                <option value="Men">Nam</option>
                <option value="Women">Nữ</option>
                <option value="Kids">Các loại</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Loại sản phẩm</label>
              <select
                value={formData.subCategory}
                onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Chọn loại sản phẩm</option>
                <option value="Topwear">Áo Thun</option>
                <option value="Bottomwear">Quần</option>
                <option value="Winterwear">Áo Khoác</option>
                <option value="Accessories">Phụ kiện</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kích cỡ</label>
              <div className="flex gap-4">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => handleSizeToggle(size)}
                    className={`px-4 py-2 rounded-md ${
                      formData.size.includes(size)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="bestseller"
                checked={formData.bestseller}
                onChange={(e) => setFormData({...formData, bestseller: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="bestseller" className="ml-2 block text-sm text-gray-700">
                Add to Bestseller
              </label>
            </div>
          </div>

          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Product Images</label>
            <div className="grid grid-cols-2 gap-4">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="relative">
                  <div 
                    className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden hover:border-blue-500 transition-colors"
                    onClick={() => document.getElementById(`image-${index}`).click()}
                  >
                    {previewImages[index] ? (
                      <img 
                        src={previewImages[index]} 
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="text-gray-400">
                          <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-500">Click to upload</div>
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    id={`image-${index}`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, index)}
                    className="hidden"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded-md ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {loading ? 'Adding...' : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Add;