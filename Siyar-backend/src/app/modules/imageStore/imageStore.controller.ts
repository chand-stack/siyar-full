import { Request, Response } from 'express';
import { ImageStoreService } from './imageStore.service';
import cloudinary from '../imageUpload/cloudinary.config';
import { envVars } from '../../config/env';
import fs from 'fs';

export class ImageStoreController {
  private imageStoreService: ImageStoreService;

  constructor() {
    this.imageStoreService = new ImageStoreService();
  }

  // Upload image to Cloudinary and store URL in database
  async uploadAndStore(req: Request, res: Response): Promise<void> {
    let localFilePath: string | undefined;
    
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
      const cloudinaryResult = await cloudinary.uploader.upload(localFilePath, {
        resource_type: "auto",
        folder: "uploads",
        use_filename: true,
        unique_filename: true,
      });

      console.log('Cloudinary upload successful:', cloudinaryResult.secure_url);

      // Store image data in database
      const savedImage = await this.imageStoreService.create({
        imageUrl: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        originalFilename: req.file.originalname,
        fileSize: req.file.size,
        fileType: req.file.mimetype
      });

      console.log('Image data saved to database:', savedImage._id);

      // Delete the local file after successful upload to Cloudinary and database
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
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

    } catch (error: any) {
      console.error('=== Upload and Store Request Failed ===');
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Clean up local file if it exists and there was an error
      if (localFilePath && fs.existsSync(localFilePath)) {
        try {
          fs.unlinkSync(localFilePath);
          console.log('Local file cleaned up after error:', localFilePath);
        } catch (cleanupError) {
          console.error('Failed to clean up local file:', cleanupError);
        }
      }
      
      res.status(500).json({
        success: false,
        message: 'Failed to upload and store image',
        error: error.message,
        details: envVars.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }

  // Store image URL directly (if you already have a URL)
  async create(req: Request, res: Response): Promise<void> {
    try {
      const { imageUrl, publicId, originalFilename, fileSize, fileType } = req.body;

      if (!imageUrl) {
        res.status(400).json({
          success: false,
          message: 'imageUrl is required'
        });
        return;
      }

      const savedImage = await this.imageStoreService.create({
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
    } catch (error: any) {
      console.error('Error storing image URL:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to store image URL',
        error: error.message
      });
    }
  }

  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const images = await this.imageStoreService.getAll();
      
      res.status(200).json({
        success: true,
        data: images,
        count: images.length
      });
    } catch (error: any) {
      console.error('Error fetching image URLs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch image URLs',
        error: error.message
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const image = await this.imageStoreService.getById(id);

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
    } catch (error: any) {
      console.error('Error fetching image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch image',
        error: error.message
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
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

      const updatedImage = await this.imageStoreService.update(id, imageUrl);

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
    } catch (error: any) {
      console.error('Error updating image URL:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update image URL',
        error: error.message
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await this.imageStoreService.delete(id);

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
    } catch (error: any) {
      console.error('Error deleting image:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete image',
        error: error.message
      });
    }
  }

  async getCount(req: Request, res: Response): Promise<void> {
    try {
      const count = await this.imageStoreService.getCount();
      
      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error: any) {
      console.error('Error fetching image count:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch image count',
        error: error.message
      });
    }
  }
}

export default ImageStoreController;
