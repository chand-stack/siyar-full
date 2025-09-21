"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const imageStore_controller_1 = __importDefault(require("./imageStore.controller"));
const router = (0, express_1.Router)();
const imageStoreController = new imageStore_controller_1.default();
// Disk storage configuration for file uploads
const diskUpload = (0, multer_1.default)({
    storage: multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/'); // Make sure this directory exists
        },
        filename: (req, file, cb) => {
            // Generate unique filename
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
        }
    }),
    fileFilter: (req, file, cb) => {
        // Allow only image files
        const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed!'));
        }
    },
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
});
// Upload image to Cloudinary and store URL in database (accepts "myfile" field name)
router.post('/upload', diskUpload.single("myfile"), imageStoreController.uploadAndStore.bind(imageStoreController));
// Alternative upload route that accepts "image" field name
router.post('/upload-image', diskUpload.single("image"), imageStoreController.uploadAndStore.bind(imageStoreController));
// Alternative upload route that accepts "file" field name
router.post('/upload-file', diskUpload.single("file"), imageStoreController.uploadAndStore.bind(imageStoreController));
// Debug endpoint to check what's being sent
router.post('/debug', (req, res) => {
    console.log('=== Debug Upload Request ===');
    console.log('Request body:', req.body);
    console.log('Request files:', req.files);
    console.log('Request file:', req.file);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('All headers:', req.headers);
    res.json({
        success: true,
        message: 'Debug info logged to console',
        data: {
            body: req.body,
            files: req.files,
            file: req.file,
            contentType: req.headers['content-type']
        }
    });
});
// Create new image URL record (if you already have a URL)
router.post('/', imageStoreController.create.bind(imageStoreController));
// Get all image URLs
router.get('/', imageStoreController.getAll.bind(imageStoreController));
// Get count of image URLs (must be before /:id route)
router.get('/stats/count', imageStoreController.getCount.bind(imageStoreController));
// Get image URL by ID
router.get('/:id', imageStoreController.getById.bind(imageStoreController));
// Update image URL
router.put('/:id', imageStoreController.update.bind(imageStoreController));
// Delete image URL (also deletes from Cloudinary)
router.delete('/:id', imageStoreController.delete.bind(imageStoreController));
exports.default = router;
