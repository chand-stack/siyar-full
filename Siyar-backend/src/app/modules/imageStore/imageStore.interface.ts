import { Types } from 'mongoose';

export interface IImageStore {
  _id?: Types.ObjectId;
  imageUrl: string;
  publicId?: string; // Cloudinary public_id for deletion
  originalFilename?: string;
  fileSize?: number;
  fileType?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
