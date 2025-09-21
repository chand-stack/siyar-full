import React, { useState, useEffect } from 'react';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '../../../../Redux/api/categoryApi';
import type { ICategory } from '../../../../Redux/api/categoryApi';
import { FaTimes, FaSave, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category?: ICategory | null;
  mode: 'create' | 'edit';
}

const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSuccess, category, mode }) => {
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    language: 'en',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (category && mode === 'edit') {
      setFormData({
        title: category.title,
        slug: category.slug || category.title?.toLowerCase().replace(/\s+/g, '-') || '',
        language: 'en',
        isActive: category.isActive
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
  }, [category, mode]);

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
    
    try {
      if (mode === 'create') {
        await createCategory(formData).unwrap();
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category created successfully',
          timer: 2000,
          showConfirmButton: false
        });
      } else if (category) {
        await updateCategory({ id: category._id, data: formData }).unwrap();
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Category updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
      }
      
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Failed to save category:', error);
      
      // Handle specific error cases
      let errorMessage = 'Failed to save category';
      if (error && typeof error === 'object' && 'data' in error && error.data && typeof error.data === 'object' && 'message' in error.data) {
        const message = String(error.data.message);
        if (message.includes('duplicate')) {
          errorMessage = 'A category with this title already exists';
          setErrors({ title: errorMessage });
        } else {
          errorMessage = message || 'Failed to save category';
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
                {isEdit ? 'Edit Category' : 'Create New Category'}
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
              <span className="label-text font-semibold">Category Title *</span>
            </label>
            <input
              type="text"
              name="title"
              className={`input input-bordered focus:input-primary w-full ${
                errors.title ? 'input-error' : ''
              }`}
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter category title..."
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
              <span className="label-text font-semibold">Category Slug *</span>
            </label>
            <input
              type="text"
              name="slug"
              className={`input input-bordered focus:input-primary w-full ${
                errors.slug ? 'input-error' : ''
              }`}
              value={formData.slug}
              onChange={handleInputChange}
              placeholder="category-slug"
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
                  ? 'Category will be visible to users' 
                  : 'Category will be hidden from users'
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
              {isEdit ? 'Update Category' : 'Create Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoryModal;
