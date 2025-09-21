import { Request, Response } from 'express';
import cloudinary from './cloudinary.config';
import { envVars } from '../../config/env';

const uploadController = async (req: Request, res: Response) => {
  try {
    console.log('=== Upload Request Started ===');
    console.log('Request body:', req.body);
    console.log('Request file:', req.file);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ 
        success: false,
        msg: 'No file uploaded' 
      });
    }

    console.log('File details:', {
      originalname: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      buffer: req.file.buffer ? 'Buffer exists' : 'No buffer'
    });

    // Check if we have a buffer (memory storage)
    if (!req.file.buffer) {
      console.log('No file buffer found');
      return res.status(400).json({ 
        success: false,
        msg: 'File buffer not found' 
      });
    }

    console.log('Starting Cloudinary upload from buffer...');
    
    // Upload buffer directly to Cloudinary using Promise-based approach
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: "uploads",
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            console.log('Cloudinary upload successful:', result?.secure_url);
            resolve(result);
          }
        }
      );

      // Write buffer to stream
      uploadStream.end(req.file!.buffer);
    });

    // Note: Since we're using memory storage (multer.memoryStorage()), 
    // files are not saved to disk, so no cleanup is needed.
    // If you were using disk storage, you would delete the file here:
    // fs.unlinkSync(req.file.path);

    return res.status(201).json({
      success: true,
      msg: "File uploaded successfully",
      data: {
        file_url: (uploadResult as any)?.secure_url,
        public_id: (uploadResult as any)?.public_id,
        original_filename: req.file.originalname,
        file_size: req.file.size,
        file_type: req.file.mimetype
      }
    });

  } catch (error: any) {
    console.error("=== Upload Request Failed ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);
    
    return res.status(500).json({ 
      success: false,
      msg: "Error uploading file", 
      error: error.message || 'Unknown error occurred',
      details: envVars.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export { uploadController };
export default uploadController;
