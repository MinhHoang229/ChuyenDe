import express from "express";
import { addProduct, listProduct, removeProduct, singleProduct } from "../controllers/productController.js";
import { upload, handleMulterError } from "../middleware/multer.js";

const productRouter = express.Router();

// Debug middleware
productRouter.use((req, res, next) => {
    console.log('Request received:', {
        method: req.method,
        url: req.url,
        contentType: req.headers['content-type'],
        contentLength: req.headers['content-length']
    });
    next();
});

// Add product route
productRouter.post("/add", 
    (req, res, next) => {
        console.log("=== START OF REQUEST PROCESSING ===");
        console.log("1. Before upload middleware");
        console.log("Headers:", JSON.stringify(req.headers, null, 2));
        next();
    },
    upload,
    handleMulterError,
    (req, res, next) => {
        console.log("2. After upload middleware");
        console.log("Files:", req.files ? Object.keys(req.files) : 'No files');
        console.log("Files detail:", JSON.stringify(req.files, null, 2));
        next();
    },
    addProduct
);

productRouter.get("/list", listProduct);
productRouter.post("/single", singleProduct);
productRouter.delete("/:id", removeProduct); // Đã sửa thành RESTful route

export default productRouter;
