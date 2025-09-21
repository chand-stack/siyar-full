import React, { useState, useEffect } from 'react';
import { useUpdateVideoMutation } from '../../../../Redux/api/videoApi';
import type { IVideo } from '../../../../Redux/api/videoApi';
import { FaTimes, FaSave, FaPlay, FaStar, FaEye, FaEyeSlash, FaEyeDropper } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface EditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  video?: IVideo;
}

const EditVideoModal: React.FC<EditVideoModalProps> = ({ isOpen, onClose, onSuccess, video }) => {
  const [updateVideo, { isLoading }] = useUpdateVideoMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    videoLink: '',
    status: 'draft' as IVideo['status'],
    isFeatured: false
  });

  // Initialize form data when video changes
  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        videoLink: video.videoLink || '',
        status: video.status || 'draft',
        isFeatured: video.isFeatured || false
      });
    }
  }, [video]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!video?._id) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Video ID is required for editing.',
        confirmButtonText: 'OK'
      });
      return;
    }
    
    try {
      await updateVideo({
        id: video._id,
        data: formData
      }).unwrap();
      
      await Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Video updated successfully',
        timer: 2000,
        showConfirmButton: false
      });
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Failed to update video:', error);
      
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update video. Please try again.',
        confirmButtonText: 'OK'
      });
    }
  };

  if (!isOpen || !video) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-warning to-warning-focus text-warning-content p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaPlay className="text-2xl" />
              <h2 className="text-2xl font-bold">Edit Video</h2>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-circle text-warning-content hover:bg-warning-focus"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Title */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-lg">Video Title *</span>
            </label>
            <input
              type="text"
              name="title"
              className="input input-bordered input-lg focus:input-warning w-full"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter video title..."
              required
            />
          </div>

          {/* Video Link */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-lg">Video Link *</span>
            </label>
            <input
              type="url"
              name="videoLink"
              className="input input-bordered input-lg focus:input-warning w-full"
              value={formData.videoLink}
              onChange={handleInputChange}
              placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
              required
            />
            <label className="label">
              <span className="label-text-alt text-base-content/70">
                Supports YouTube, Vimeo, or direct video URLs
              </span>
            </label>
          </div>

          {/* Status and Featured */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-lg">Status</span>
              </label>
              <select
                name="status"
                className="select select-bordered select-lg focus:select-warning w-full"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label cursor-pointer">
                <span className="label-text font-semibold text-lg flex items-center gap-2">
                  <FaStar className="text-warning" />
                  Featured Video
                </span>
                <input
                  type="checkbox"
                  name="isFeatured"
                  className="toggle toggle-warning toggle-lg"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
              </label>
              <label className="label">
                <span className="label-text-alt text-base-content/70">
                  Only one video can be featured at a time
                </span>
              </label>
            </div>
          </div>

          {/* Current Video Info */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold text-lg">Current Video Info</span>
            </label>
            <div className="border-2 border-dashed border-base-300 rounded-lg p-4 bg-base-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">Views:</span>
                  <span className="ml-2">{video.views || 0}</span>
                </div>
                <div>
                  <span className="font-semibold">Created:</span>
                  <span className="ml-2">{new Date(video.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-semibold">Last Updated:</span>
                  <span className="ml-2">{new Date(video.updatedAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-semibold">ID:</span>
                  <span className="ml-2 font-mono text-xs">{video._id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Preview */}
          {formData.videoLink && (
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold text-lg">Preview</span>
              </label>
              <div className="border-2 border-dashed border-base-300 rounded-lg p-4 bg-base-200">
                <div className="flex items-center gap-3">
                  <FaPlay className="text-4xl text-warning" />
                  <div>
                    <div className="font-semibold">{formData.title || 'Untitled Video'}</div>
                    <div className="text-sm opacity-70 break-all">{formData.videoLink}</div>
                    <div className="flex gap-2 mt-2">
                      {getStatusBadge(formData.status)}
                      {formData.isFeatured && (
                        <span className="badge badge-warning gap-1">
                          <FaStar />
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-4 pt-6 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost btn-lg"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-warning btn-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-md"></span>
              ) : (
                <FaSave />
              )}
              Update Video
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Helper function to get status badge
function getStatusBadge(status: IVideo['status']) {
  const statusConfig = {
    draft: { color: 'badge-warning', icon: FaEyeSlash, text: 'Draft' },
    published: { color: 'badge-success', icon: FaEye, text: 'Published' },
    archived: { color: 'badge-neutral', icon: FaEyeDropper, text: 'Archived' }
  };
  
  const config = statusConfig[status];
  const Icon = config.icon;
  
  return (
    <span className={`badge ${config.color} gap-1`}>
      <Icon className="text-xs" />
      {config.text}
    </span>
  );
}

export default EditVideoModal;
