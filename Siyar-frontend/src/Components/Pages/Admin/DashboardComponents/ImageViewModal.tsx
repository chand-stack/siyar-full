import React, { useState } from 'react';
import { useUpdateImageMutation } from '../../../../Redux/api/imageApi';
import type { IImage } from '../../../../Redux/api/imageApi';
import { FaTimes, FaEdit, FaSave, FaEye, FaLink, FaCopy, FaCheck, FaCalendar, FaFileAlt, FaWeightHanging, FaImage } from 'react-icons/fa';

interface ImageViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: IImage | null;
  onUpdate?: () => void;
}

const ImageViewModal: React.FC<ImageViewModalProps> = ({ isOpen, onClose, image, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedImageUrl, setEditedImageUrl] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [updateImage, { isLoading: isUpdating }] = useUpdateImageMutation();

  React.useEffect(() => {
    if (image) {
      setEditedImageUrl(image.imageUrl);
    }
  }, [image]);

  const handleUpdate = async () => {
    if (!image || !editedImageUrl.trim()) return;

    try {
      const result = await updateImage({
        id: image._id,
        imageUrl: editedImageUrl.trim(),
      }).unwrap();

      if (result.success) {
        alert('Image URL updated successfully!');
        setIsEditing(false);
        onUpdate?.();
      }
    } catch (err: any) {
      console.error('Update failed:', err);
      alert(err?.data?.message || 'Update failed. Please try again.');
    }
  };

  const handleCopyUrl = async () => {
    if (!image) return;

    const url = image.imageUrl;
    
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch (error) {
      console.log('Modern clipboard API failed, using fallback:', error);
    }

    // Fallback for older browsers or non-secure contexts
    try {
      const textArea = document.createElement('textarea');
      textArea.value = url;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        throw new Error('execCommand copy failed');
      }
    } catch (fallbackError) {
      console.error('All copy methods failed:', fallbackError);
      alert('Could not copy URL to clipboard. Please copy manually.');
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
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen || !image) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <FaEye className="text-primary" />
            Image Details
          </h3>
          <button
            className="btn btn-sm btn-circle btn-ghost"
            onClick={onClose}
            disabled={isUpdating}
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base flex items-center gap-2">
                  <FaImage className="text-primary" />
                  Image Preview
                </h4>
                <div className="flex justify-center">
                  <img
                    src={image.imageUrl}
                    alt={image.originalFilename || 'Uploaded image'}
                    className="max-w-full max-h-80 object-contain rounded-lg shadow-md"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Image URL Section */}
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="card-title text-base flex items-center gap-2">
                    <FaLink className="text-primary" />
                    Image URL
                  </h4>
                  <div className="flex gap-2">
                    {!isEditing && (
                      <>
                        <button
                          className="btn btn-sm btn-outline"
                          onClick={handleCopyUrl}
                          title="Copy URL to clipboard"
                        >
                          {copied ? <FaCheck className="text-success" /> : <FaCopy />}
                          {copied ? 'Copied!' : 'Copy'}
                        </button>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => setIsEditing(true)}
                          title="Edit URL"
                        >
                          <FaEdit />
                          Edit
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editedImageUrl}
                      onChange={(e) => setEditedImageUrl(e.target.value)}
                      className="textarea textarea-bordered w-full h-20 text-sm"
                      placeholder="Enter image URL..."
                      disabled={isUpdating}
                    />
                    <div className="flex gap-2">
                      <button
                        className="btn btn-success btn-sm"
                        onClick={handleUpdate}
                        disabled={isUpdating || !editedImageUrl.trim()}
                      >
                        {isUpdating ? (
                          <>
                            <span className="loading loading-spinner loading-sm"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <FaSave />
                            Save
                          </>
                        )}
                      </button>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => {
                          setIsEditing(false);
                          setEditedImageUrl(image.imageUrl);
                        }}
                        disabled={isUpdating}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-base-100 p-3 rounded-lg">
                    <code className="text-sm break-all">{image.imageUrl}</code>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Image Information */}
          <div className="space-y-4">
            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base flex items-center gap-2 mb-4">
                  <FaFileAlt className="text-primary" />
                  File Information
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-base-100 rounded">
                    <span className="font-medium text-sm">Original Filename:</span>
                    <span className="text-sm text-right break-all ml-2">
                      {image.originalFilename || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-base-100 rounded">
                    <span className="font-medium text-sm flex items-center gap-1">
                      <FaWeightHanging className="text-xs" />
                      File Size:
                    </span>
                    <span className="text-sm">{formatFileSize(image.fileSize)}</span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-base-100 rounded">
                    <span className="font-medium text-sm">File Type:</span>
                    <span className="text-sm">{image.fileType || 'N/A'}</span>
                  </div>

                  {image.publicId && (
                    <div className="flex items-center justify-between p-2 bg-base-100 rounded">
                      <span className="font-medium text-sm">Cloudinary ID:</span>
                      <span className="text-sm text-right break-all ml-2 font-mono">
                        {image.publicId}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base flex items-center gap-2 mb-4">
                  <FaCalendar className="text-primary" />
                  Timestamps
                </h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2 bg-base-100 rounded">
                    <span className="font-medium text-sm">Created:</span>
                    <span className="text-sm text-right">
                      {formatDate(image.createdAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 bg-base-100 rounded">
                    <span className="font-medium text-sm">Updated:</span>
                    <span className="text-sm text-right">
                      {formatDate(image.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-200">
              <div className="card-body p-4">
                <h4 className="card-title text-base flex items-center gap-2 mb-4">
                  <FaLink className="text-primary" />
                  Quick Actions
                </h4>
                
                <div className="space-y-2">
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => window.open(image.imageUrl, '_blank')}
                  >
                    <FaEye />
                    Open in New Tab
                  </button>
                  
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={handleCopyUrl}
                  >
                    {copied ? <FaCheck className="text-success" /> : <FaCopy />}
                    {copied ? 'URL Copied!' : 'Copy Image URL'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="modal-action">
          <button
            className="btn btn-ghost"
            onClick={onClose}
            disabled={isUpdating}
          >
            Close
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
};

export default ImageViewModal;
