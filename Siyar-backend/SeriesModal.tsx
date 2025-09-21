import React, { useState, useEffect } from 'react';
import { useCreateSeriesMutation, useUpdateSeriesMutation } from '../../../../Redux/api/seriesApi';
import type { ISeries } from '../../../../Redux/api/seriesApi';
import { FaTimes, FaSave, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface SeriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  series?: ISeries | null;
  mode: 'create' | 'edit';
}

const SeriesModal: React.FC<SeriesModalProps> = ({ isOpen, onClose, onSuccess, series, mode }) => {
  const [createSeries, { isLoading: isCreating }] = useCreateSeriesMutation();
  const [updateSeries, { isLoading: isUpdating }] = useUpdateSeriesMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    language: 'en',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (series && mode === 'edit') {
      setFormData({
        title: series.title,
        slug: series.slug || series.title?.toLowerCase().replace(/\s+/g, '-') || '',
        language: series.language || 'en',
        isActive: series.isActive
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        language: 'en',
        isActive: true
      });
    }
    setErrors({});
  }, [series, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    }

    if (formData.slug.trim().length < 2) {
      newErrors.slug = 'Slug must be at least 2 characters long';
    }

    // Validate slug format (only lowercase letters, numbers, and hyphens)
    if (!/^[a-z0-9-]+$/.test(formData.slug.trim())) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.language.trim()) {
      newErrors.language = 'Language is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      };
      
      // Auto-generate slug when title changes
      if (name === 'title') {
        newData.slug = value.toLowerCase().replace(/\s+/g, '-');
      }
      
      return newData;
    });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    // Debug: Log what's being sent
    console.log('Form data being sent:', formData);
    console.log('Form data keys:', Object.keys(formData));
    console.log('Language value:', formData.language);
    console.log('Slug value:', formData.slug);
    
    try {
      if (mode === 'create') {
        await createSeries(formData).unwrap();
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Series created successfully',
          timer: 2000,
          showConfirmButton: false
        });
      } else if (series) {
        await updateSeries({ id: series._id, data: formData }).unwrap();
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Series updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Failed to save series:', error);
      
      // Handle specific error cases
      let errorMessage = 'Failed to save series';
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
        const message = String(error.data.message);
        if (message.includes('duplicate')) {
          errorMessage = 'A series with this slug already exists in this language';
          setErrors({ slug: errorMessage });
        } else {
          errorMessage = message || 'Failed to save series';
          setErrors({ general: errorMessage });
        }
      } else {
        setErrors({ general: errorMessage });
      }
      
      // Show error message with Swal
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
  };

  if (!isOpen) return null;

  const isLoading = isCreating || isUpdating;
  const isEdit = mode === 'edit';

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-focus text-primary-content p-6 rounded-t-2xl">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold">
                {isEdit ? 'Edit Series' : 'Create New Series'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-circle text-primary-content hover:bg-primary-focus"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Title Input */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-semibold">Series Title *</span>
            </label>
            <input
              type="text"
              name="title"
              className={`input input-bordered focus:input-primary w-full ${
                errors.title ? 'input-error' : ''
              }`}
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter series title..."
              required
            />
            {errors.title && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.title}</span>
              </label>
            )}
          </div>

          {/* Slug Input */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-semibold">Series Slug *</span>
            </label>
            <input
              type="text"
              name="slug"
              className={`input input-bordered focus:input-primary w-full ${
                errors.slug ? 'input-error' : ''
              }`}
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="series-slug"
              required
            />
            {errors.slug && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.slug}</span>
              </label>
            )}
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                URL-friendly version of the title (auto-generated)
              </span>
            </label>
          </div>

          {/* Language Input */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-semibold">Language *</span>
            </label>
            <select
              name="language"
              className={`select select-bordered focus:select-primary w-full ${
                errors.language ? 'select-error' : ''
              }`}
              value={formData.language}
              onChange={handleInputChange}
              required
            >
              <option value="en">English</option>
              <option value="ar">Arabic</option>
              <option value="tr">Turkish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="es">Spanish</option>
            </select>
            {errors.language && (
              <label className="label">
                <span className="label-text-alt text-error">{errors.language}</span>
              </label>
            )}
          </div>

          {/* Active Status Toggle */}
          <div className="form-control mb-6">
            <label className="label cursor-pointer">
              <span className="label-text font-semibold flex items-center gap-2">
                {formData.isActive ? <FaToggleOn className="text-success" /> : <FaToggleOff className="text-base-content/40" />}
                Active Status
              </span>
              <input
                type="checkbox"
                name="isActive"
                className="toggle toggle-primary toggle-lg"
                checked={formData.isActive}
                onChange={handleInputChange}
              />
            </label>
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                {formData.isActive 
                  ? 'Series will be visible to users' 
                  : 'Series will be hidden from users'
                }
              </span>
            </label>
          </div>

          {/* General Error Display */}
          {errors.general && (
            <div className="alert alert-error mb-6">
              <span>{errors.general}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-base-300">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost flex-1"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <FaSave />
              )}
              {isEdit ? 'Update Series' : 'Create Series'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SeriesModal;
