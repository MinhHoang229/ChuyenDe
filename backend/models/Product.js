import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true
    },
    subCategory: {
        type: String,
        required: [true, 'Product subcategory is required'],
        trim: true
    },
    size: {
        type: [String],
        required: [true, 'Product size is required']
    },
    bestseller: {
        type: Boolean,
        default: false
    },
    images: {
        type: [String],
        required: [true, 'At least one product image is required'],
        validate: {
            validator: function(v) {
                return v.length > 0;
            },
            message: 'Product must have at least one image'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Product = mongoose.model('Product', productSchema);

export default Product; 