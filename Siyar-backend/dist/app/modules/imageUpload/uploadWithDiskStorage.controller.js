"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadWithDiskStorageController = void 0;
const cloudinary_config_1 = __importDefault(require("./cloudinary.config"));
const env_1 = require("../../config/env");
const fs_1 = __importDefault(require("fs"));
const uploadWithDiskStorageController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let filePath;
    try {
        console.log('=== Upload Request Started (Disk Storage) ===');
        console.log('Request body:', req.body);
        console.log('Request file:', req.file);
        if (!req.file) {
            console.log('No file in request');
            return res.status(400).json({
                success: false,
                msg: 'No file uploaded'
            });
        }
        filePath = req.file.path;
        console.log('File saved to:', filePath);
        console.log('File details:', {
            originalname: req.file.originalname,
            size: req.file.size,
            mimetype: req.file.mimetype,
            path: filePath
        });
        console.log('Starting Cloudinary upload from disk...');
        // Upload file to Cloudinary
        const uploadResult = yield cloudinary_config_1.default.uploader.upload(filePath, {
            resource_type: "auto",
            folder: "uploads",
            use_filename: true,
            unique_filename: true,
        });
        console.log('Cloudinary upload successful:', uploadResult.secure_url);
        // Delete the local file after successful upload
        if (fs_1.default.existsSync(filePath)) {
            fs_1.default.unlinkSync(filePath);
            console.log('Local file deleted:', filePath);
        }
        return res.status(201).json({
            success: true,
            msg: "File uploaded successfully",
            data: {
                file_url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
                original_filename: req.file.originalname,
                file_size: req.file.size,
                file_type: req.file.mimetype
            }
        });
    }
    catch (error) {
        console.error("=== Upload Request Failed ===");
        console.error("Error type:", typeof error);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
        console.error("Full error object:", error);
        // Clean up local file if it exists
        if (filePath && fs_1.default.existsSync(filePath)) {
            try {
                fs_1.default.unlinkSync(filePath);
                console.log('Local file cleaned up after error:', filePath);
            }
            catch (cleanupError) {
                console.error('Failed to clean up local file:', cleanupError);
            }
        }
        return res.status(500).json({
            success: false,
            msg: "Error uploading file",
            error: error.message || 'Unknown error occurred',
            details: env_1.envVars.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
});
exports.uploadWithDiskStorageController = uploadWithDiskStorageController;
exports.default = uploadWithDiskStorageController;
