import React, { useState } from 'react';
import { 
  useUploadImageMutation, 
  useStoreImageInDBMutation, 
  useGetImagesQuery, 
  useDeleteImageMutation 
} from '../../../../Redux/api/imageApi';
import type { IImage } from '../../../../Redux/api/imageApi';
import { FaUpload, FaCheck, FaCopy, FaTrash, FaEye, FaImage, FaSpinner } from 'react-icons/fa';

const CompleteImageManager: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStep, setUploadStep] = useState<'idle' | 'uploading' | 'storing' | 'complete'>('idle');
  const [copiedId, setCopiedId] = useState<string>('');
  
  const [uploadImage] = useUploadImageMutation();
  const [storeImageInDB] = useStoreImageInDBMutation();
  const { data: imagesData, isLoading: isLoadingImages, refetch } = useGetImagesQuery();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();

  const images = imagesData?.data || [];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setUploadStep('idle');
    }
  };

  const handleCompleteUpload = async () => {
    if (!selectedFile) return;

    try {
      // Step 1: Upload to Cloudinary
      setUploadStep('uploading');
      const formData = new FormData();
      formData.append('myfile', selectedFile);

      console.log('Step 1: Uploading to Cloudinary...');
      const cloudinaryResult = await uploadImage(formData).unwrap();
      
      if (!cloudinaryResult.success) {
        throw new Error('Cloudinary upload failed');
      }

      console.log('Step 1 Complete: Cloudinary upload successful');
      console.log('Live URL:', cloudinaryResult.data.file_url);

      // Step 2: Store in MongoDB
      setUploadStep('storing');
      console.log('Step 2: Storing in MongoDB...');
      
      const storeResult = await storeImageInDB({
        imageUrl: cloudinaryResult.data.file_url,
        publicId: cloudinaryResult.data.public_id,
        originalFilename: cloudinaryResult.data.original_filename,
        fileSize: cloudinaryResult.data.file_size,
        fileType: cloudinaryResult.data.file_type,
      }).unwrap();

      if (!storeResult.success) {
        throw new Error('Database storage failed');
      }

      console.log('Step 2 Complete: Stored in MongoDB');
      console.log('Database ID:', storeResult.data._id);

      setUploadStep('complete');
      setSelectedFile(null);
      
      // Refresh the images list
      refetch();
      
      alert(`✅ Upload Complete!\n\n🌐 Live URL: ${cloudinaryResult.data.file_url}\n💾 Stored in Database: ${storeResult.data._id}`);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setUploadStep('idle');
      }, 3000);

    } catch (err) {
      console.error('Upload process failed:', err);
      setUploadStep('idle');
      const errorMessage = err && typeof err === 'object' && 'data' in err && err.data && typeof err.data === 'object' && 'message' in err.data 
        ? String(err.data.message)
        : err instanceof Error 
        ? err.message 
        : 'Unknown error';
      alert(`❌ Upload Failed: ${errorMessage}`);
    }
  };

  const handleCopyUrl = async (url: string, imageId: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
      } else {
        // Fallback
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      
      setCopiedId(imageId);
      setTimeout(() => setCopiedId(''), 2000);
    } catch (err) {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL to clipboard');
    }
  };

  const handleDeleteImage = async (image: IImage) => {
    if (!confirm(`Are you sure you want to delete this image?\n\n${image.originalFilename || 'Untitled'}\n\nThis will delete it from both Cloudinary and the database.`)) {
      return;
    }

    try {
      const result = await deleteImage(image._id).unwrap();
      if (result.success) {
        alert('✅ Image deleted successfully!');
        refetch();
      }
    } catch (err) {
      console.error('Delete failed:', err);
      const errorMessage = err && typeof err === 'object' && 'data' in err && err.data && typeof err.data === 'object' && 'message' in err.data 
        ? String(err.data.message)
        : 'Unknown error';
      alert(`❌ Delete failed: ${errorMessage}`);
    }
  };

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStepMessage = () => {
    switch (uploadStep) {
      case 'uploading':
        return '📤 Step 1/2: Uploading to Cloudinary...';
      case 'storing':
        return '💾 Step 2/2: Storing in MongoDB...';
      case 'complete':
        return '✅ Complete! Image uploaded and stored successfully!';
      default:
        return '';
    }
  };

  const isProcessing = uploadStep !== 'idle';

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3">
        <FaImage className="text-3xl text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Complete Image Manager</h1>
          <p className="text-base-content/70 mt-1">
            Upload to Cloudinary → Store in MongoDB → Manage live links ({images.length} stored)
          </p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <FaUpload className="text-primary" />
            Upload New Image
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="label">
                <span className="label-text">Select Image File</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input file-input-bordered w-full"
                disabled={isProcessing}
              />
            </div>

            {selectedFile && (
              <div className="alert alert-info">
                <div>
                  <strong>Selected:</strong> {selectedFile.name} ({formatFileSize(selectedFile.size)})
                  <br />
                  <strong>Type:</strong> {selectedFile.type}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="alert alert-warning">
                <FaSpinner className="animate-spin" />
                <span>{getStepMessage()}</span>
              </div>
            )}

            <button
              className="btn btn-primary btn-lg w-full"
              onClick={handleCompleteUpload}
              disabled={!selectedFile || isProcessing}
            >
              {isProcessing ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FaUpload />
                  Upload to Cloudinary & Store in DB
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Images List */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2">
            <FaImage className="text-primary" />
            Stored Images ({images.length})
          </h2>

          {isLoadingImages ? (
            <div className="flex items-center justify-center py-12">
              <FaSpinner className="animate-spin text-2xl text-primary mr-3" />
              <span>Loading stored images...</span>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No images stored yet</h3>
              <p className="text-base-content/70">Upload your first image to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th>Preview</th>
                    <th>Details</th>
                    <th>Live URL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {images.map((image) => (
                    <tr key={image._id}>
                      <td>
                        <div className="avatar">
                          <div className="mask mask-squircle w-16 h-16">
                            <img 
                              src={image.imageUrl} 
                              alt={image.originalFilename || 'Image'}
                              className="object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjMyIiB5PSIzNiIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEwIiBmaWxsPSIjOUZBNkI3IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5JbWFnZTwvdGV4dD4KPHN2Zz4=';
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <div className="font-semibold text-sm">
                            {image.originalFilename || 'Untitled'}
                          </div>
                          <div className="text-xs text-base-content/70">
                            {formatFileSize(image.fileSize)} • {image.fileType}
                          </div>
                          <div className="text-xs text-base-content/50">
                            {formatDate(image.createdAt)}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs">
                          <div className="truncate text-xs font-mono bg-base-200 p-2 rounded">
                            {image.imageUrl}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => window.open(image.imageUrl, '_blank')}
                            title="View full image"
                          >
                            <FaEye />
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleCopyUrl(image.imageUrl, image._id)}
                            title="Copy URL"
                          >
                            {copiedId === image._id ? (
                              <FaCheck className="text-success" />
                            ) : (
                              <FaCopy />
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() => handleDeleteImage(image)}
                            disabled={isDeleting}
                            title="Delete image"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompleteImageManager;
