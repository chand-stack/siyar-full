import { v2 as cloudinary } from 'cloudinary';
import { envVars } from '../../config/env';

console.log('Cloudinary environment variables loaded successfully');

// Configure Cloudinary
try {
  cloudinary.config({
    cloud_name: envVars.CLOUD_NAME,
    api_key: envVars.API_KEY,
    api_secret: envVars.API_SECRET,
  });
  console.log('Cloudinary configured successfully');
} catch (error) {
  console.error('Failed to configure Cloudinary:', error);
  throw error;
}

export default cloudinary;
