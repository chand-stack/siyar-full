# Image Upload Module

This module handles image uploads to Cloudinary with two storage options.

## Features

- Direct upload to Cloudinary
- Memory storage (recommended for serverless/Vercel)
- Disk storage option (for local development)
- Automatic file cleanup after upload
- Image file type validation
- File size limits (10MB)

## Environment Variables Required

Add these to your `.env` file:

```env
CLOUD_NAME=your-cloudinary-cloud-name
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
```

## API Endpoints

### POST `/api/image-upload/`
Upload image using memory storage (recommended)
- Field name: `myfile`
- Max size: 10MB
- Allowed types: jpeg, jpg, png, gif, webp, svg

### POST `/api/image-upload/disk`
Upload image using disk storage (saves temporarily to uploads folder)
- Field name: `myfile`
- Max size: 10MB
- Allowed types: jpeg, jpg, png, gif, webp, svg
- Automatically deletes local file after Cloudinary upload

## Response Format

### Success Response (201)
```json
{
  "success": true,
  "msg": "File uploaded successfully",
  "data": {
    "file_url": "https://res.cloudinary.com/...",
    "public_id": "uploads/filename",
    "original_filename": "image.jpg",
    "file_size": 1024000,
    "file_type": "image/jpeg"
  }
}
```

### Error Response (400/500)
```json
{
  "success": false,
  "msg": "Error message",
  "error": "Detailed error message"
}
```

## Usage Example

### Using cURL
```bash
curl -X POST http://localhost:5000/api/image-upload/ \
  -F "myfile=@/path/to/image.jpg"
```

### Using JavaScript/Fetch
```javascript
const formData = new FormData();
formData.append('myfile', fileInput.files[0]);

fetch('/api/image-upload/', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    console.log('Upload successful:', data.data.file_url);
  }
});
```

## Storage Options

### Memory Storage (Default)
- Files are processed in memory
- No temporary files created on disk
- Ideal for serverless environments
- Faster processing for small to medium files

### Disk Storage
- Files are temporarily saved to `uploads/` folder
- Automatically cleaned up after Cloudinary upload
- Better for very large files
- Requires write permissions to uploads directory
