import ImageStore from './imageStore.model';
import { IImageStore } from './imageStore.interface';
import cloudinary from '../imageUpload/cloudinary.config';

export class ImageStoreService {
  async create(imageData: {
    imageUrl: string;
    publicId?: string;
    originalFilename?: string;
    fileSize?: number;
    fileType?: string;
  }): Promise<IImageStore> {
    const imageStore = new ImageStore(imageData);
    const saved = await imageStore.save();
    return saved.toObject();
  }

  async getAll(): Promise<IImageStore[]> {
    const images = await ImageStore.find().sort({ createdAt: -1 });
    return images.map(img => img.toObject());
  }

  async getById(id: string): Promise<IImageStore | null> {
    const image = await ImageStore.findById(id);
    return image ? image.toObject() : null;
  }

  async update(id: string, imageUrl: string): Promise<IImageStore | null> {
    const updatedImage = await ImageStore.findByIdAndUpdate(
      id,
      { imageUrl },
      { new: true, runValidators: true }
    );
    return updatedImage ? updatedImage.toObject() : null;
  }

  async delete(id: string): Promise<boolean> {
    try {
      const image = await ImageStore.findById(id);
      
      if (!image) {
        return false;
      }

      // Delete from Cloudinary if publicId exists
      if (image.publicId) {
        try {
          await cloudinary.uploader.destroy(image.publicId);
          console.log('Image deleted from Cloudinary:', image.publicId);
        } catch (cloudinaryError) {
          console.error('Failed to delete from Cloudinary:', cloudinaryError);
          // Continue with database deletion even if Cloudinary deletion fails
        }
      }

      // Delete from database
      const result = await ImageStore.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error('Error deleting image:', error);
      return false;
    }
  }

  async getCount(): Promise<number> {
    return await ImageStore.countDocuments();
  }

  async deleteByPublicId(publicId: string): Promise<boolean> {
    try {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);
      
      // Delete from database
      const result = await ImageStore.findOneAndDelete({ publicId });
      return !!result;
    } catch (error) {
      console.error('Error deleting image by publicId:', error);
      return false;
    }
  }
}
