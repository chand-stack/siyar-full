import { Request, Response } from 'express';
import cloudinary from './cloudinary.config';
import { envVars } from '../../config/env';
import fs from 'fs';
import path from 'path';

const uploadWithDiskStorageController = async (req: Request, res: Response) => {
  let filePath: string | undefined;
  
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
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      resource_type: "auto",
      folder: "uploads",
      use_filename: true,
      unique_filename: true,
    });

    console.log('Cloudinary upload successful:', uploadResult.secure_url);

    // Delete the local file after successful upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
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

  } catch (error: any) {
    console.error("=== Upload Request Failed ===");
    console.error("Error type:", typeof error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("Full error object:", error);
    
    // Clean up local file if it exists
    if (filePath && fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        console.log('Local file cleaned up after error:', filePath);
      } catch (cleanupError) {
        console.error('Failed to clean up local file:', cleanupError);
      }
    }
    
    return res.status(500).json({ 
      success: false,
      msg: "Error uploading file", 
      error: error.message || 'Unknown error occurred',
      details: envVars.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

export { uploadWithDiskStorageController };
export default uploadWithDiskStorageController;
