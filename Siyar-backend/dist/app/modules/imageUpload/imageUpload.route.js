"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const upload_controller_1 = __importDefault(require("./upload.controller"));
const uploadWithDiskStorage_controller_1 = __importDefault(require("./uploadWithDiskStorage.controller"));
const router = (0, express_1.Router)();
// Memory storage configuration (recommended for Vercel/serverless)
const memoryUpload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
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
// Disk storage configuration (for local development)
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
// Default route using memory storage (recommended)
router.post("/", memoryUpload.single("myfile"), upload_controller_1.default);
// Alternative route using disk storage
router.post("/disk", diskUpload.single("myfile"), uploadWithDiskStorage_controller_1.default);
exports.default = router;
