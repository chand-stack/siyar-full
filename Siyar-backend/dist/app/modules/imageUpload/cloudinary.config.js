"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const env_1 = require("../../config/env");
console.log('Cloudinary environment variables loaded successfully');
// Configure Cloudinary
try {
    cloudinary_1.v2.config({
        cloud_name: env_1.envVars.CLOUD_NAME,
        api_key: env_1.envVars.API_KEY,
        api_secret: env_1.envVars.API_SECRET,
    });
    console.log('Cloudinary configured successfully');
}
catch (error) {
    console.error('Failed to configure Cloudinary:', error);
    throw error;
}
exports.default = cloudinary_1.v2;
