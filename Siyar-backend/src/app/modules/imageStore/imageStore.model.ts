import mongoose, { Schema } from 'mongoose';
import { IImageStore } from './imageStore.interface';

const imageStoreSchema = new Schema<IImageStore>({
  imageUrl: {
    type: String,
    required: true,
    trim: true
  },
  publicId: {
    type: String,
    required: false,
    trim: true
  },
  originalFilename: {
    type: String,
    required: false,
    trim: true
  },
  fileSize: {
    type: Number,
    required: false
  },
  fileType: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

const ImageStore = mongoose.model<IImageStore>('ImageStore', imageStoreSchema);

export default ImageStore;
