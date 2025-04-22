import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import Title from '../components/Title'

const Collection = () => {
    const { products, search, setSearch } = useContext(ShopContext);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortOption, setSortOption] = useState('default');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12; // Số sản phẩm mỗi trang

    const categories = ['Men', 'Women', 'Khác'];
    const types = ['Topwear', 'Bottomwear', 'Winterwear'];

    const filteredProducts = products.filter(product => {
        const matchesCategory = selectedCategories.length === 0 || 
            selectedCategories.some(category => product.category.toLowerCase().includes(category.toLowerCase()));
        
        const matchesType = selectedTypes.length === 0 || 
            selectedTypes.some(type => product.subCategory.toLowerCase().includes(type.toLowerCase()));
        
        const matchesSearch = search === '' || 
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.description.toLowerCase().includes(search.toLowerCase());

        return matchesCategory && matchesType && matchesSearch;
    });

    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOption) {
            case 'price-low-high':
                return a.price - b.price;
            case 'price-high-low':
                return b.price - a.price;
            case 'name-a-z':
                return a.name.localeCompare(b.name);
            case 'name-z-a':
                return b.name.localeCompare(a.name);
            default:
                return 0;
        }
    });

    // Tính toán số trang
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

    // Lấy sản phẩm cho trang hiện tại
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Tạo mảng số trang để hiển thị
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Xử lý khi chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
            <div className='text-3xl font-bold text-gray-900 mb-8'>
                <Title text1={'Bộ'} text2={'Sưu Tập'} />
            </div>

            <div className='flex flex-col lg:flex-row gap-8'>
                {/* Filters */}
                <div className='lg:w-64 flex-shrink-0'>
                    <div className='bg-white rounded-xl shadow-sm p-6 sticky top-6'>
                        <h3 className='text-lg font-semibold mb-4'>Bộ lọc</h3>
                        
                        <div className='space-y-6'>
                            {/* Categories */}
                            <div>
                                <h4 className='font-medium mb-3'>Danh mục</h4>
                                <div className='space-y-2'>
                                    {categories.map((category) => (
                                        <label key={category} className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                checked={selectedCategories.includes(category)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedCategories([...selectedCategories, category]);
                                                    } else {
                                                        setSelectedCategories(selectedCategories.filter(c => c !== category));
                                                    }
                                                    setCurrentPage(1); // Reset về trang 1 khi lọc
                                                }}
                                                className='w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500'
                                            />
                                            <span className='ml-2 text-gray-700'>{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Types */}
                            <div>
                                <h4 className='font-medium mb-3'>Loại</h4>
                                <div className='space-y-2'>
                                    {types.map((type) => (
                                        <label key={type} className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                checked={selectedTypes.includes(type)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedTypes([...selectedTypes, type]);
                                                    } else {
                                                        setSelectedTypes(selectedTypes.filter(t => t !== type));
                                                    }
                                                    setCurrentPage(1); // Reset về trang 1 khi lọc
                                                }}
                                                className='w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500'
                                            />
                                            <span className='ml-2 text-gray-700'>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Sort */}
                            <div>
                                <h4 className='font-medium mb-3'>Sắp xếp</h4>
                                <select
                                    value={sortOption}
                                    onChange={(e) => {
                                        setSortOption(e.target.value);
                                        setCurrentPage(1); // Reset về trang 1 khi sắp xếp
                                    }}
                                    className='w-full border-gray-300 rounded-lg shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                                >
                                    <option value="default">Mặc định</option>
                                    <option value="price-low-high">Giá: Thấp đến cao</option>
                                    <option value="price-high-low">Giá: Cao đến thấp</option>
                                    <option value="name-a-z">Tên: A-Z</option>
                                    <option value="name-z-a">Tên: Z-A</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div className='flex-1'>
                    {/* Search */}
                    <div className='mb-6'>
                        <div className='relative'>
                            <input
                                type='text'
                                placeholder='Tìm kiếm sản phẩm...'
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                                }}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                            />
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <svg className='h-5 w-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {currentProducts.length > 0 ? (
                        <>
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                                {currentProducts.map((item, index) => (
                                    <ProductItem
                                        key={index}
                                        id={item._id}
                                        image={item.images?.[0]}
                                        name={item.name}
                                        price={item.price}
                                    />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className='mt-8 flex justify-center gap-2'>
                                    <button
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className={`px-4 py-2 rounded-lg ${
                                            currentPage === 1
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        } border`}
                                    >
                                        Trước
                                    </button>
                                    
                                    {pageNumbers.map(number => (
                                        <button
                                            key={number}
                                            onClick={() => handlePageChange(number)}
                                            className={`px-4 py-2 rounded-lg border ${
                                                currentPage === number
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {number}
                                        </button>
                                    ))}

                                    <button
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                        className={`px-4 py-2 rounded-lg ${
                                            currentPage === totalPages
                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'bg-white text-gray-700 hover:bg-gray-50'
                                        } border`}
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className='text-center py-12'>
                            <p className='text-gray-500 text-lg'>Không tìm thấy sản phẩm phù hợp</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Collection;
