import React, { useState } from 'react';
import { useGetImagesQuery, useDeleteImageMutation } from '../../../../Redux/api/imageApi';
import type { IImage } from '../../../../Redux/api/imageApi';
import { FaEye, FaTrash, FaImage, FaCloudUploadAlt, FaSearch, FaDownload, FaCopy, FaCheck, FaExclamationTriangle, FaTh, FaList, FaUpload } from 'react-icons/fa';
import ImageUploadModal from './ImageUploadModal.tsx';
import ImageViewModal from './ImageViewModal.tsx';

const ImageManagement: React.FC = () => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<IImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const { data: imagesData, isLoading, error, refetch } = useGetImagesQuery();
  const [deleteImage, { isLoading: isDeleting }] = useDeleteImageMutation();

  const images = imagesData?.data || [];

  // Filter images based on search term and filter type
  const filteredImages = images.filter((image) => {
    const matchesSearch = 
      image.originalFilename?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.fileType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      image.imageUrl.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'jpg' && (image.fileType?.includes('jpeg') || image.fileType?.includes('jpg'))) ||
      (filterType === 'png' && image.fileType?.includes('png')) ||
      (filterType === 'gif' && image.fileType?.includes('gif')) ||
      (filterType === 'webp' && image.fileType?.includes('webp')) ||
      (filterType === 'svg' && image.fileType?.includes('svg'));

    return matchesSearch && matchesFilter;
  });

  const handleViewImage = (image: IImage) => {
    setSelectedImage(image);
    setViewModalOpen(true);
  };

  const handleDeleteImage = async (image: IImage) => {
    if (!confirm(`Are you sure you want to delete "${image.originalFilename || 'this image'}"?\n\nThis will also delete the image from Cloudinary and cannot be undone.`)) {
      return;
    }

    try {
      const result = await deleteImage(image._id).unwrap();
      if (result.success) {
        alert('Image deleted successfully!');
      }
    } catch (err: unknown) {
      console.error('Delete failed:', err);
      alert((err as { data: { message: string } })?.data?.message || 'Failed to delete image. Please try again.');
    }
  };

  const handleCopyUrl = async (url: string, imageId: string) => {
    if (!url) {
      alert('No URL to copy');
      return;
    }

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        setCopiedId(imageId);
        setTimeout(() => setCopiedId(''), 2000);
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
        setCopiedId(imageId);
        setTimeout(() => setCopiedId(''), 2000);
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
    return new Date(dateString).toLocaleDateString();
  };

  const getFileTypeIcon = (fileType?: string) => {
    if (!fileType) return '📄';
    if (fileType.includes('jpeg') || fileType.includes('jpg')) return '🖼️';
    if (fileType.includes('png')) return '🖼️';
    if (fileType.includes('gif')) return '🎬';
    if (fileType.includes('webp')) return '🖼️';
    if (fileType.includes('svg')) return '🎨';
    return '📄';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-lg">Loading images...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <FaExclamationTriangle />
        <div>
          <h3 className="font-bold">Error loading images</h3>
          <div className="text-xs">{(error as unknown as { data: { message: string } })?.data?.message || 'Failed to load images'}</div>
        </div>
        <button className="btn btn-sm" onClick={() => refetch()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-center gap-3">
          <FaImage className="text-3xl text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Image Management</h1>
            <p className="text-base-content/70 mt-1">
              Upload, organize, and manage your website images ({images.length} total)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn btn-outline btn-sm"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <FaList className="mr-2" /> : <FaTh className="mr-2" />}
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </button>
          <button
            className="btn btn-primary"
            onClick={() => setUploadModalOpen(true)}
          >
            <FaUpload className="mr-2" />
            Upload New Image
          </button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="card bg-base-100 shadow-sm border-2 border-dashed border-primary/20 hover:border-primary/40 transition-colors">
        <div className="card-body p-6">
          <div className="flex items-center gap-3 mb-4">
            <FaUpload className="text-primary text-xl" />
            <div>
              <h3 className="text-lg font-semibold">Upload New Image</h3>
              <p className="text-sm text-base-content/70">
                Upload images to your media library. Supported formats: JPEG, PNG, GIF, WebP, SVG. Max size: 10MB
              </p>
            </div>
          </div>
          
          <button
            className="btn btn-primary btn-lg w-full lg:w-auto"
            onClick={() => setUploadModalOpen(true)}
          >
            <FaCloudUploadAlt className="mr-2" />
            Choose Image File
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-base-content/50" />
            <input
              type="text"
              placeholder="Search images..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <select
          className="select select-bordered w-full lg:w-48"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="all">All Images</option>
          <option value="jpg">JPEG/JPG</option>
          <option value="png">PNG</option>
          <option value="gif">GIF</option>
          <option value="webp">WebP</option>
          <option value="svg">SVG</option>
        </select>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {filteredImages.length} Image{filteredImages.length !== 1 ? 's' : ''}
          </h3>
          {(searchTerm || filterType !== 'all') && (
            <button
              className="btn btn-xs btn-ghost"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {images.length === 0 ? 'No images uploaded yet' : 'No images match your search'}
            </h3>
            <p className="text-base-content/70 mb-6">
              {images.length === 0 
                ? 'Upload your first image to get started'
                : 'Try adjusting your search terms or filters'
              }
            </p>
            {images.length === 0 && (
              <button
                className="btn btn-primary"
                onClick={() => setUploadModalOpen(true)}
              >
                <FaCloudUploadAlt className="mr-2" />
                Upload First Image
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <div key={image._id} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow group">
                <figure className="aspect-square overflow-hidden bg-base-200 relative">
                  <img
                    src={image.imageUrl}
                    alt={image.originalFilename || 'Uploaded image'}
                    className="w-full h-full object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
                    onClick={() => handleViewImage(image)}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-1">
                    <button
                      className="btn btn-sm btn-circle btn-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewImage(image);
                      }}
                      title="View details"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-circle btn-error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteImage(image);
                      }}
                      disabled={isDeleting}
                      title="Delete image"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </figure>
                
                <div className="card-body p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="badge badge-outline text-xs">
                      {formatDate(image.createdAt)}
                    </div>
                    <span className="text-lg">
                      {getFileTypeIcon(image.fileType)}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      className="btn btn-sm btn-outline flex-1"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCopyUrl(image.imageUrl, image._id);
                      }}
                    >
                      {copiedId === image._id ? (
                        <>
                          <FaCheck className="text-success mr-2" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <FaCopy className="mr-2" />
                          Copy URL
                        </>
                      )}
                    </button>
                    <button
                      className="btn btn-sm btn-outline"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        window.open(image.imageUrl, '_blank');
                      }}
                      title="Open in new tab"
                    >
                      <FaDownload />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredImages.map((image) => (
              <div key={image._id} className="card bg-base-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="card-body p-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 overflow-hidden rounded-lg flex-shrink-0">
                      <img
                        src={image.imageUrl}
                        alt={image.originalFilename || 'Uploaded image'}
                        className="w-full h-full object-cover cursor-pointer"
                        onClick={() => handleViewImage(image)}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlmYTZiNyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4=';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="truncate">
                          <p className="font-medium truncate text-sm">
                            {image.originalFilename || image.imageUrl.split('/').pop()}
                          </p>
                          <p className="text-xs text-base-content/70">
                            Added {formatDate(image.createdAt)} • {formatFileSize(image.fileSize)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleViewImage(image)}
                          >
                            <FaEye className="mr-2" />
                            View
                          </button>
                          <button
                            className="btn btn-sm btn-outline"
                            onClick={() => handleCopyUrl(image.imageUrl, image._id)}
                          >
                            {copiedId === image._id ? (
                              <>
                                <FaCheck className="text-success mr-2" />
                                Copied
                              </>
                            ) : (
                              <>
                                <FaCopy className="mr-2" />
                                Copy
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-error btn-outline"
                            onClick={() => handleDeleteImage(image)}
                            disabled={isDeleting}
                          >
                            <FaTrash className="mr-2" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <ImageUploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* View Modal */}
      <ImageViewModal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedImage(null);
        }}
        image={selectedImage}
        onUpdate={() => refetch()}
      />
    </div>
  );
};

export default ImageManagement;
