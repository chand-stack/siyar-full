# Image Store Module

This module provides a complete image management system that uploads images to Cloudinary and stores the metadata in MongoDB.

## Features

- **Upload & Store**: Upload images to Cloudinary and automatically store metadata in database
- **Full CRUD Operations**: Create, Read, Update, Delete image records
- **Cloudinary Integration**: Automatic cleanup when deleting images
- **File Validation**: Only image files allowed (jpeg, jpg, png, gif, webp, svg)
- **Size Limits**: 10MB maximum file size
- **Metadata Storage**: Stores original filename, file size, file type, and Cloudinary public_id

## Database Schema

```typescript
interface IImageStore {
  _id?: Types.ObjectId;
  imageUrl: string;           // Cloudinary secure_url
  publicId?: string;          // Cloudinary public_id for deletion
  originalFilename?: string;  // Original file name
  fileSize?: number;          // File size in bytes
  fileType?: string;          // MIME type
  createdAt?: Date;           // Auto-generated
  updatedAt?: Date;           // Auto-generated
}
```

## API Endpoints

### POST `/api/images/upload`
**Upload image to Cloudinary and store in database**
- Field name: `image`
- Max size: 10MB
- Allowed types: jpeg, jpg, png, gif, webp, svg
- Returns complete image data with Cloudinary URL

**Example:**
```bash
curl -X POST http://localhost:5000/api/images/upload \
  -F "image=@/path/to/image.jpg"
```

**Response:**
```json
{
  "success": true,
  "message": "Image uploaded and stored successfully",
  "data": {
    "id": "64f7b1234567890abcdef123",
    "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/uploads/filename.jpg",
    "publicId": "uploads/filename",
    "originalFilename": "image.jpg",
    "fileSize": 1024000,
    "fileType": "image/jpeg",
    "createdAt": "2023-09-14T10:30:00.000Z"
  }
}
```

### POST `/api/images/`
**Store image URL directly (if you already have a Cloudinary URL)**
```json
{
  "imageUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/uploads/filename.jpg",
  "publicId": "uploads/filename",
  "originalFilename": "image.jpg",
  "fileSize": 1024000,
  "fileType": "image/jpeg"
}
```

### GET `/api/images/`
**Get all stored images**
- Returns array of all image records
- Sorted by creation date (newest first)

### GET `/api/images/:id`
**Get specific image by ID**

### PUT `/api/images/:id`
**Update image URL**
```json
{
  "imageUrl": "https://new-cloudinary-url.jpg"
}
```

### DELETE `/api/images/:id`
**Delete image**
- Deletes from both Cloudinary and database
- Uses stored `publicId` for Cloudinary deletion

### GET `/api/images/stats/count`
**Get total count of stored images**

## Usage Examples

### Frontend JavaScript/Fetch
```javascript
// Upload image
const formData = new FormData();
formData.append('image', fileInput.files[0]);

fetch('/api/images/upload', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Image uploaded:', data.data.imageUrl);
    // Use data.data.imageUrl in your application
  }
});

// Get all images
fetch('/api/images/')
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Images:', data.data);
  }
});

// Delete image
fetch(`/api/images/${imageId}`, {
  method: 'DELETE'
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Image deleted successfully');
  }
});
```

### React Component Example
```jsx
import React, { useState } from 'react';

const ImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/images/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setImageUrl(data.data.imageUrl);
        console.log('Upload successful:', data.data);
      } else {
        console.error('Upload failed:', data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {imageUrl && (
        <div>
          <p>Upload successful!</p>
          <img src={imageUrl} alt="Uploaded" style={{maxWidth: '300px'}} />
          <p>URL: {imageUrl}</p>
        </div>
      )}
    </div>
  );
};
```

## Workflow

1. **User uploads image** → Frontend sends file to `/api/images/upload`
2. **Server receives file** → Validates file type and size, saves to `uploads/` folder
3. **Upload to Cloudinary** → File uploaded from `uploads/` folder to Cloudinary
4. **Store in database** → Image metadata saved to MongoDB with Cloudinary URL
5. **Clean up local file** → File deleted from `uploads/` folder automatically
6. **Return response** → Frontend receives Cloudinary URL and metadata
7. **Use image URL** → Frontend can display image using live Cloudinary URL

## Error Handling

All endpoints return standardized error responses:
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message"
}
```

## Benefits

- ✅ **Automatic Cleanup**: Deleting from database also removes from Cloudinary
- ✅ **Local File Cleanup**: Files automatically deleted from uploads folder after Cloudinary upload
- ✅ **Metadata Tracking**: Keep track of original filenames, sizes, types
- ✅ **Scalable Storage**: Uses Cloudinary CDN for fast image delivery
- ✅ **Database Efficiency**: Only stores URLs and metadata, not binary data
- ✅ **Easy Integration**: RESTful API that works with any frontend
- ✅ **Disk Storage**: Uses uploads folder for temporary storage before Cloudinary upload
- ✅ **Error Recovery**: Local files cleaned up even if errors occur
