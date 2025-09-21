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
exports.ImageStoreService = void 0;
const imageStore_model_1 = __importDefault(require("./imageStore.model"));
const cloudinary_config_1 = __importDefault(require("../imageUpload/cloudinary.config"));
class ImageStoreService {
    create(imageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const imageStore = new imageStore_model_1.default(imageData);
            const saved = yield imageStore.save();
            return saved.toObject();
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const images = yield imageStore_model_1.default.find().sort({ createdAt: -1 });
            return images.map(img => img.toObject());
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const image = yield imageStore_model_1.default.findById(id);
            return image ? image.toObject() : null;
        });
    }
    update(id, imageUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedImage = yield imageStore_model_1.default.findByIdAndUpdate(id, { imageUrl }, { new: true, runValidators: true });
            return updatedImage ? updatedImage.toObject() : null;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const image = yield imageStore_model_1.default.findById(id);
                if (!image) {
                    return false;
                }
                // Delete from Cloudinary if publicId exists
                if (image.publicId) {
                    try {
                        yield cloudinary_config_1.default.uploader.destroy(image.publicId);
                        console.log('Image deleted from Cloudinary:', image.publicId);
                    }
                    catch (cloudinaryError) {
                        console.error('Failed to delete from Cloudinary:', cloudinaryError);
                        // Continue with database deletion even if Cloudinary deletion fails
                    }
                }
                // Delete from database
                const result = yield imageStore_model_1.default.findByIdAndDelete(id);
                return !!result;
            }
            catch (error) {
                console.error('Error deleting image:', error);
                return false;
            }
        });
    }
    getCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield imageStore_model_1.default.countDocuments();
        });
    }
    deleteByPublicId(publicId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete from Cloudinary
                yield cloudinary_config_1.default.uploader.destroy(publicId);
                // Delete from database
                const result = yield imageStore_model_1.default.findOneAndDelete({ publicId });
                return !!result;
            }
            catch (error) {
                console.error('Error deleting image by publicId:', error);
                return false;
            }
        });
    }
}
exports.ImageStoreService = ImageStoreService;
