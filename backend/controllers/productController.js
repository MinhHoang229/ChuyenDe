import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import Product from '../models/Product.js';

const addProduct = async (req, res) => {
    try {
        console.log("=== Starting product upload ===");
        console.log("Files received:", req.files);
        console.log("Form data received:", req.body);

        // Validate request
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({
                success: false,
                message: "No files were uploaded"
            });
        }

        // Configure cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET
        });

        // Extract product data
        const { name, description, price, category, subCategory, size, bestseller } = req.body;

        // Initialize array to store image URLs
        const imageUrls = [];

        // Process each image
        for (let i = 1; i <= 4; i++) {
            const fieldName = `image${i}`;
            if (req.files[fieldName] && req.files[fieldName][0]) {
                const file = req.files[fieldName][0];
                console.log(`Processing ${fieldName}:`, file.originalname);

                try {
                    // Upload to Cloudinary
                    const result = await cloudinary.uploader.upload(file.path, {
                        folder: 'products'
                    });
                    console.log(`${fieldName} uploaded to Cloudinary:`, result.secure_url);
                    imageUrls.push(result.secure_url);

                    // Delete local file after upload
                    fs.unlinkSync(file.path);
                } catch (uploadError) {
                    console.error(`Error uploading ${fieldName}:`, uploadError);
                    return res.status(500).json({
                        success: false,
                        message: `Error uploading ${fieldName}`,
                        error: uploadError.message
                    });
                }
            }
        }

        // If no images were uploaded successfully
        if (imageUrls.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No images were uploaded successfully"
            });
        }

        // Create product data object
        const productData = {
            name,
            description,
            price: Number(price),
            category,
            subCategory,
            size: JSON.parse(size),
            bestseller: bestseller === 'true',
            images: imageUrls
        };

        console.log("Creating new product with data:", productData);

        // Save to database
        const product = new Product(productData);
        await product.save();

        console.log("Product saved successfully:", product._id);

        return res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });

    } catch (error) {
        console.error("Controller error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// List products
const listProduct = async (req, res) => {
    try {
        // Get query parameters for filtering
        const { category, subCategory, minPrice, maxPrice } = req.query;

        // Build filter object
        const filter = {};
        if (category) filter.category = category;
        if (subCategory) filter.subCategory = subCategory;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        console.log("Applying filters:", filter);

        // Find products with filters
        const products = await Product.find(filter)
            .sort({ createdAt: -1 }); // Sort by newest first

        console.log(`Found ${products.length} products`);

        return res.json({
            success: true,
            count: products.length,
            products
        });

    } catch (error) {
        console.log(error);
        return res.json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get single product
const singleProduct = async (req, res) => {
    try {
        const { id } = req.body;
        
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching product",
            error: error.message
        });
    }
};

// Remove product
const removeProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Remove product controller called with ID:', id);

        if (!id) {
            console.log('No ID provided');
            return res.status(400).json({
                success: false,
                message: "Thiếu ID sản phẩm"
            });
        }

        const product = await Product.findById(id);
        console.log('Found product:', product);

        if (!product) {
            console.log('Product not found with ID:', id);
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy sản phẩm"
            });
        }

        // Xóa ảnh từ Cloudinary nếu có
        if (product.images && product.images.length > 0) {
            console.log('Deleting images from Cloudinary');
            for (const imageUrl of product.images) {
                const publicId = imageUrl.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`products/${publicId}`);
            }
        }

        // Xóa sản phẩm từ database
        console.log('Deleting product from database');
        await Product.findByIdAndDelete(id);
        console.log('Product deleted successfully');

        return res.status(200).json({
            success: true,
            message: "Xóa sản phẩm thành công"
        });
    } catch (error) {
        console.error('Error in removeProduct controller:', error);
        return res.status(500).json({
            success: false,
            message: "Lỗi khi xóa sản phẩm",
            error: error.message
        });
    }
};

  

export { addProduct, listProduct, removeProduct, singleProduct }; 