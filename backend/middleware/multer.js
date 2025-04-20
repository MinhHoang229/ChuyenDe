import multer from "multer";
import path from "path";

// Basic storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        console.log("Multer destination function called for file:", {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });
        const uploadPath = path.join(process.cwd(), 'uploads');
        console.log("Upload path:", uploadPath);
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        console.log("Multer filename function called for file:", file.originalname);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        const finalFilename = file.fieldname + '-' + uniqueSuffix + ext;
        console.log("Generated filename:", finalFilename);
        cb(null, finalFilename);
    }
});

// Error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error("Multer error:", err);
        return res.status(400).json({
            success: false,
            message: `Upload error: ${err.message}`,
            code: err.code
        });
    } else if (err) {
        console.error("Unknown error:", err);
        return res.status(500).json({
            success: false,
            message: "Unknown error occurred during file upload"
        });
    }
    next();
};

// Multer configuration
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
        files: 4 // Maximum 4 files
    },
    fileFilter: (req, file, cb) => {
        console.log("Multer fileFilter called for file:", {
            fieldname: file.fieldname,
            originalname: file.originalname,
            mimetype: file.mimetype
        });

        // Accept only images
        if (!file.mimetype.startsWith('image/')) {
            console.log("Rejected file:", file.originalname, "- Not an image");
            return cb(new Error('Only image files are allowed!'), false);
        }

        console.log("Accepted file:", file.originalname);
        cb(null, true);
    }
}).fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]);

export { upload, handleMulterError };

