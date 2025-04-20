import React, { useContext, useState } from 'react'
import { ShopContext } from '../context/ShopContext'
import ProductItem from '../components/ProductItem'
import { assets } from '../assets/assets'

const Collection = () => {
    const { products, search, setSearch } = useContext(ShopContext);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [sortOption, setSortOption] = useState('default');

    const categories = ['Men', 'Women', 'Kids'];
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

    const toggleCategory = (category) => {
        setSelectedCategories(prev => 
            prev.includes(category) 
                ? prev.filter(c => c !== category)
                : [...prev, category]
        );
    };

    const toggleType = (type) => {
        setSelectedTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type)
                : [...prev, type]
        );
    };

    return (
        <div className='max-w-7xl mx-auto px-4 py-8'>
            <div className='flex flex-col md:flex-row gap-8'>

                {/* Filters */}
                <div className='w-full md:w-64 space-y-6'>
                    <div className='bg-white p-4 rounded-lg shadow mr-9 mt-10'>
                        <h3 className='text-lg font-semibold mb-4'>Bộ lọc</h3>
                        
                        <div className='space-y-4'>
                            <div>
                                <h4 className='font-medium mb-2'>Danh mục</h4>
                                <div className='space-y-2'>
                                    {categories.map(category => (
                                        <label key={category} className='flex items-center space-x-2 cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={selectedCategories.includes(category)}
                                                onChange={() => toggleCategory(category)}
                                                className='rounded text-blue-500 focus:ring-blue-500'
                                            />
                                            <span>{category}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className='font-medium mb-2'>Loại sản phẩm</h4>
                                <div className='space-y-2'>
                                    {types.map(type => (
                                        <label key={type} className='flex items-center space-x-2 cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={selectedTypes.includes(type)}
                                                onChange={() => toggleType(type)}
                                                className='rounded text-blue-500 focus:ring-blue-500'
                                            />
                                            <span>{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className='mt-2'>
                                <p className='mb-2'>Giá</p>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className='border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
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

                {/* Products + Search */}
                <div className='flex-1'>
                    {/* Search bar + title */}
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6 relative">
                        {/* Title - always positioned left, but hidden on search */}
                        <h2 className="text-2xl font-bold">
                            TẤT CẢ SẢN PHẨM
                            </h2>


                        {/* Search input */}
                        <div className="w-full md:w-96 relative ml-10">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {search && (
                                <img
                                    src={assets.cross_icon}
                                    alt="clear"
                                    className="absolute right-10 top-1/2 transform -translate-y-1/2 w-4 h-4 cursor-pointer hover:opacity-70"
                                    onClick={() => setSearch('')}
                                />
                            )}
                            <img
                                src={assets.search_icon}
                                alt="search"
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Product Grid */}
                    {sortedProducts.length > 0 ? (
                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
                            {sortedProducts.map((item, index) => (
                                <ProductItem
                                    key={index}
                                    id={item._id}
                                    image={item.images?.[0]}
                                    name={item.name}
                                    price={item.price}
                                />
                            ))}
                        </div>
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
