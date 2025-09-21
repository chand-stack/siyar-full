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
exports.ImageStoreController = void 0;
const imageStore_service_1 = require("./imageStore.service");
const cloudinary_config_1 = __importDefault(require("../imageUpload/cloudinary.config"));
const env_1 = require("../../config/env");
const fs_1 = __importDefault(require("fs"));
class ImageStoreController {
    constructor() {
        this.imageStoreService = new imageStore_service_1.ImageStoreService();
    }
    // Upload image to Cloudinary and store URL in database
    uploadAndStore(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let localFilePath;
            try {
                console.log('=== Image Upload and Store Request Started ===');
                if (!req.file) {
                    res.status(400).json({
                        success: false,
                        message: 'No file uploaded'
                    });
                    return;
                }
                localFilePath = req.file.path;
                console.log('File saved to uploads folder:', localFilePath);
                console.log('File details:', {
                    originalname: req.file.originalname,
                    size: req.file.size,
                    mimetype: req.file.mimetype,
                    path: localFilePath
                });
                console.log('Starting Cloudinary upload from uploads folder...');
                // Upload file from uploads folder to Cloudinary
                const cloudinaryResult = yield cloudinary_config_1.default.uploader.upload(localFilePath, {
                    resource_type: "auto",
                    folder: "uploads",
                    use_filename: true,
                    unique_filename: true,
                });
                console.log('Cloudinary upload successful:', cloudinaryResult.secure_url);
                // Store image data in database
                const savedImage = yield this.imageStoreService.create({
                    imageUrl: cloudinaryResult.secure_url,
                    publicId: cloudinaryResult.public_id,
                    originalFilename: req.file.originalname,
                    fileSize: req.file.size,
                    fileType: req.file.mimetype
                });
                console.log('Image data saved to database:', savedImage._id);
                // Delete the local file after successful upload to Cloudinary and database
                if (localFilePath && fs_1.default.existsSync(localFilePath)) {
                    fs_1.default.unlinkSync(localFilePath);
                    console.log('Local file deleted from uploads folder:', localFilePath);
                }
                res.status(201).json({
                    success: true,
                    message: 'Image uploaded to Cloudinary, stored in database, and local file cleaned up',
                    data: {
                        id: savedImage._id,
                        imageUrl: savedImage.imageUrl,
                        publicId: savedImage.publicId,
                        originalFilename: savedImage.originalFilename,
                        fileSize: savedImage.fileSize,
                        fileType: savedImage.fileType,
                        createdAt: savedImage.createdAt
                    }
                });
            }
            catch (error) {
                console.error('=== Upload and Store Request Failed ===');
                console.error('Error message:', error.message);
                console.error('Error stack:', error.stack);
                // Clean up local file if it exists and there was an error
                if (localFilePath && fs_1.default.existsSync(localFilePath)) {
                    try {
                        fs_1.default.unlinkSync(localFilePath);
                        console.log('Local file cleaned up after error:', localFilePath);
                    }
                    catch (cleanupError) {
                        console.error('Failed to clean up local file:', cleanupError);
                    }
                }
                res.status(500).json({
                    success: false,
                    message: 'Failed to upload and store image',
                    error: error.message,
                    details: env_1.envVars.NODE_ENV === 'development' ? error.stack : undefined
                });
            }
        });
    }
    // Store image URL directly (if you already have a URL)
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { imageUrl, publicId, originalFilename, fileSize, fileType } = req.body;
                if (!imageUrl) {
                    res.status(400).json({
                        success: false,
                        message: 'imageUrl is required'
                    });
                    return;
                }
                const savedImage = yield this.imageStoreService.create({
                    imageUrl,
                    publicId,
                    originalFilename,
                    fileSize,
                    fileType
                });
                res.status(201).json({
                    success: true,
                    message: 'Image URL stored successfully',
                    data: savedImage
                });
            }
            catch (error) {
                console.error('Error storing image URL:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to store image URL',
                    error: error.message
                });
            }
        });
    }
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const images = yield this.imageStoreService.getAll();
                res.status(200).json({
                    success: true,
                    data: images,
                    count: images.length
                });
            }
            catch (error) {
                console.error('Error fetching image URLs:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch image URLs',
                    error: error.message
                });
            }
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const image = yield this.imageStoreService.getById(id);
                if (!image) {
                    res.status(404).json({
                        success: false,
                        message: 'Image not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    data: image
                });
            }
            catch (error) {
                console.error('Error fetching image:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch image',
                    error: error.message
                });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { imageUrl } = req.body;
                if (!imageUrl) {
                    res.status(400).json({
                        success: false,
                        message: 'imageUrl is required'
                    });
                    return;
                }
                const updatedImage = yield this.imageStoreService.update(id, imageUrl);
                if (!updatedImage) {
                    res.status(404).json({
                        success: false,
                        message: 'Image not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Image URL updated successfully',
                    data: updatedImage
                });
            }
            catch (error) {
                console.error('Error updating image URL:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to update image URL',
                    error: error.message
                });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield this.imageStoreService.delete(id);
                if (!deleted) {
                    res.status(404).json({
                        success: false,
                        message: 'Image not found'
                    });
                    return;
                }
                res.status(200).json({
                    success: true,
                    message: 'Image deleted successfully from both Cloudinary and database'
                });
            }
            catch (error) {
                console.error('Error deleting image:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to delete image',
                    error: error.message
                });
            }
        });
    }
    getCount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.imageStoreService.getCount();
                res.status(200).json({
                    success: true,
                    data: { count }
                });
            }
            catch (error) {
                console.error('Error fetching image count:', error);
                res.status(500).json({
                    success: false,
                    message: 'Failed to fetch image count',
                    error: error.message
                });
            }
        });
    }
}
exports.ImageStoreController = ImageStoreController;
exports.default = ImageStoreController;
