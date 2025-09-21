# Image Store API Endpoints

## Upload Endpoints (Different Field Names)

### 1. POST `/api/images/upload`
- **Field name:** `myfile`
- **Description:** Main upload endpoint (disk storage → Cloudinary → DB → cleanup)
- **Usage:** `formData.append('myfile', file)`

### 2. POST `/api/images/upload-image` 
- **Field name:** `image`
- **Description:** Alternative upload endpoint
- **Usage:** `formData.append('image', file)`

### 3. POST `/api/images/upload-file`
- **Field name:** `file`
- **Description:** Alternative upload endpoint
- **Usage:** `formData.append('file', file)`

### 4. POST `/api/images/debug`
- **Description:** Debug endpoint to see what your frontend is sending
- **Returns:** Complete request details for debugging

## CRUD Endpoints

- **POST** `/api/images/` - Store URL directly
- **GET** `/api/images/` - Get all images
- **GET** `/api/images/:id` - Get specific image
- **PUT** `/api/images/:id` - Update image URL
- **DELETE** `/api/images/:id` - Delete image (from both DB and Cloudinary)
- **GET** `/api/images/stats/count` - Get image count

## Testing from Frontend

```javascript
// Try different field names to see which one works:

// Option 1: myfile
const formData1 = new FormData();
formData1.append('myfile', file);
fetch('/api/images/upload', { method: 'POST', body: formData1 });

// Option 2: image  
const formData2 = new FormData();
formData2.append('image', file);
fetch('/api/images/upload-image', { method: 'POST', body: formData2 });

// Option 3: file
const formData3 = new FormData();
formData3.append('file', file);
fetch('/api/images/upload-file', { method: 'POST', body: formData3 });

// Debug what you're sending
fetch('/api/images/debug', { method: 'POST', body: formData1 })
.then(r => r.json())
.then(data => console.log('Debug response:', data));
```

## Error "Unexpected field" Solutions

1. **Check field name** - Use `/api/images/debug` to see what field name your frontend sends
2. **Use correct endpoint** - Match the endpoint to your field name
3. **Check Content-Type** - Should be `multipart/form-data`
4. **File validation** - Only images allowed (jpeg, jpg, png, gif, webp, svg)
5. **Size limit** - Maximum 10MB

## Complete Workflow
1. File uploaded to `uploads/` folder
2. File uploaded from `uploads/` to Cloudinary  
3. Cloudinary URL + metadata saved to MongoDB
4. Local file deleted from `uploads/` folder
5. Response with live Cloudinary URL returned
