"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Debug script for image upload module
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load environment variables
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), '.env') });
console.log('=== Image Upload Module Debug ===');
console.log('Current working directory:', process.cwd());
console.log('Environment variables:');
console.log('- CLOUD_NAME:', process.env.CLOUD_NAME ? 'SET' : 'MISSING');
console.log('- API_KEY:', process.env.API_KEY ? 'SET' : 'MISSING');
console.log('- API_SECRET:', process.env.API_SECRET ? 'SET' : 'MISSING');
// Check uploads directory
const fs_1 = __importDefault(require("fs"));
const uploadsPath = path_1.default.join(process.cwd(), 'uploads');
console.log('Uploads directory path:', uploadsPath);
console.log('Uploads directory exists:', fs_1.default.existsSync(uploadsPath));
try {
    fs_1.default.accessSync(uploadsPath, fs_1.default.constants.R_OK);
    console.log('Uploads directory readable: YES');
}
catch (_a) {
    console.log('Uploads directory readable: NO');
}
try {
    fs_1.default.accessSync(uploadsPath, fs_1.default.constants.W_OK);
    console.log('Uploads directory writable: YES');
}
catch (_b) {
    console.log('Uploads directory writable: NO');
}
// Test Cloudinary configuration
try {
    const cloudinary = require('./cloudinary.config').default;
    console.log('Cloudinary config loaded successfully');
}
catch (error) {
    console.error('Cloudinary config error:', error.message);
}
console.log('=== Debug Complete ===');
