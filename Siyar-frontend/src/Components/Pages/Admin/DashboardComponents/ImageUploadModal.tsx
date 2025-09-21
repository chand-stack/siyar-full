import React, { useState } from 'react';
import { useUploadImageMutation } from '../../../../Redux/api/imageApi';
import { FaCloudUploadAlt, FaImage, FaTimes, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const ImageUploadModal: React.FC<ImageUploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [dragActive, setDragActive] = useState(false);
  
  const [uploadImage, { isLoading, error }] = useUploadImageMutation();

  const handleFileSelect = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only image files (JPEG, JPG, PNG, GIF, WebP, SVG) are allowed!');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB!');
      return;
    }

    setSelectedFile(file);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('myfile', selectedFile);

      const result = await uploadImage(formData).unwrap();
      
      if (result.success) {
        alert(`Image uploaded successfully!\nLive URL: ${result.data.file_url}`);
        handleClose();
        onSuccess?.();
      }
    } catch (err: any) {
      console.error('Upload failed:', err);
      alert(err?.data?.message || 'Upload failed. Please try again.');
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setDragActive(false);
    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaCloudUploadAlt className="text-primary" />
            Upload Image to Cloudinary
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            <FaTimes />
          </button>
        </div>

        {/* Upload Area */}
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive
              ? 'border-primary bg-primary/10'
              : selectedFile
              ? 'border-success bg-success/10'
              : 'border-gray-300 hover:border-primary hover:bg-primary/5'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {!selectedFile ? (
            <>
              <FaCloudUploadAlt className="text-4xl text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-semibold mb-2">
                {dragActive ? 'Drop your image here!' : 'Drag & drop your image here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                or click to browse files
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="file-input file-input-bordered file-input-primary w-full max-w-xs"
                disabled={isLoading}
              />
              <div className="mt-4 text-xs text-gray-500">
                <p>Supported formats: JPEG, JPG, PNG, GIF, WebP, SVG</p>
                <p>Maximum file size: 10MB</p>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <FaCheck className="text-4xl text-success mx-auto" />
              <p className="text-lg font-semibold text-success">File Selected!</p>
              
              {/* File Preview */}
              {previewUrl && (
                <div className="flex justify-center">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="max-h-48 max-w-full object-contain rounded-lg shadow-md"
                  />
                </div>
              )}
              
              {/* File Details */}
              <div className="bg-base-200 rounded-lg p-4 text-left">
                <div className="flex items-center gap-2 mb-2">
                  <FaImage className="text-primary" />
                  <span className="font-semibold">File Details</span>
                </div>
                <div className="space-y-1 text-sm">
                  <p><strong>Name:</strong> {selectedFile.name}</p>
                  <p><strong>Size:</strong> {formatFileSize(selectedFile.size)}</p>
                  <p><strong>Type:</strong> {selectedFile.type}</p>
                </div>
              </div>

              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl('');
                }}
                disabled={isLoading}
              >
                Choose Different File
              </button>
            </div>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="alert alert-error mt-4">
            <FaExclamationTriangle />
            <span>{(error as any)?.data?.message || 'Upload failed. Please try again.'}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Uploading...
              </>
            ) : (
              <>
                <FaCloudUploadAlt />
                Upload to Cloudinary
              </>
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
};

export default ImageUploadModal;
