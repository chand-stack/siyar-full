// Debug script for image upload module
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env') });

console.log('=== Image Upload Module Debug ===');
console.log('Current working directory:', process.cwd());
console.log('Environment variables:');
console.log('- CLOUD_NAME:', process.env.CLOUD_NAME ? 'SET' : 'MISSING');
console.log('- API_KEY:', process.env.API_KEY ? 'SET' : 'MISSING');
console.log('- API_SECRET:', process.env.API_SECRET ? 'SET' : 'MISSING');

// Check uploads directory
import fs from 'fs';
const uploadsPath = path.join(process.cwd(), 'uploads');
console.log('Uploads directory path:', uploadsPath);
console.log('Uploads directory exists:', fs.existsSync(uploadsPath));

try {
  fs.accessSync(uploadsPath, fs.constants.R_OK);
  console.log('Uploads directory readable: YES');
} catch {
  console.log('Uploads directory readable: NO');
}

try {
  fs.accessSync(uploadsPath, fs.constants.W_OK);
  console.log('Uploads directory writable: YES');
} catch {
  console.log('Uploads directory writable: NO');
}

// Test Cloudinary configuration
try {
  const cloudinary = require('./cloudinary.config').default;
  console.log('Cloudinary config loaded successfully');
} catch (error: any) {
  console.error('Cloudinary config error:', error.message);
}

console.log('=== Debug Complete ===');
