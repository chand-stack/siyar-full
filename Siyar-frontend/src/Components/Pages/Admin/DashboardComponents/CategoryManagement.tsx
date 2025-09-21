import React, { useState } from 'react';
import { useGetCategoriesQuery, useDeleteCategoryMutation } from '../../../../Redux/api/categoryApi';
import type { ICategory } from '../../../../Redux/api/categoryApi';
import { FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff, FaSearch } from 'react-icons/fa';
import CategoryModal from './CategoryModal';
import Swal from 'sweetalert2';

const CategoryManagement: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: categoriesResponse, isLoading, refetch } = useGetCategoriesQuery({});
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  const categories = categoriesResponse?.data || [];

  // Filter categories based on search and filters
  const filteredCategories = categories.filter((category) => {
    const matchesSearch = category.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && category.isActive) || 
      (statusFilter === 'inactive' && !category.isActive);
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateCategory = () => {
    setModalMode('create');
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleEditCategory = (category: ICategory) => {
    setModalMode('edit');
    setSelectedCategory(category);
    setShowModal(true);
  };

  const handleDeleteCategory = async (category: ICategory) => {
    // Show confirmation dialog with Swal
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${category.title}"? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deleteCategory(category._id).unwrap();
        
        // Show success message
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Category has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });
        
        // The API will automatically refetch due to cache invalidation
      } catch (error) {
        console.error('Failed to delete category:', error);
        
        // Show error message
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to delete category. Please try again.',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleModalSuccess = () => {
    refetch(); // Refetch categories after successful operation
  };

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <span className="badge badge-success gap-1">
        <FaToggleOn />
        Active
      </span>
    ) : (
      <span className="badge badge-warning gap-1">
        <FaToggleOff />
        Inactive
      </span>
    );
  };

  const stats = {
    total: categories.length,
    active: categories.filter(c => c.isActive).length,
    inactive: categories.filter(c => !c.isActive).length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl lg:text-2xl font-bold">Category Management</h2>
        <button 
          className="btn btn-primary btn-sm lg:btn-md w-full sm:w-auto"
          onClick={handleCreateCategory}
        >
          <FaPlus />
          Add New Category
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-2 lg:gap-4">
        <div className="stat bg-base-100 p-2 lg:p-4 rounded-lg text-center border">
          <div className="stat-title text-xs lg:text-sm">Total</div>
          <div className="stat-value text-primary text-lg lg:text-2xl">{stats.total}</div>
        </div>
        <div className="stat bg-base-100 p-2 lg:p-4 rounded-lg text-center border">
          <div className="stat-title text-xs lg:text-sm">Active</div>
          <div className="stat-value text-success text-lg lg:text-2xl">{stats.active}</div>
        </div>
        <div className="stat bg-base-100 p-2 lg:p-4 rounded-lg text-center border">
          <div className="stat-title text-xs lg:text-sm">Inactive</div>
          <div className="stat-value text-warning text-lg lg:text-2xl">{stats.inactive}</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-3 lg:p-6">
          <h3 className="card-title text-base lg:text-lg">Filters & Search</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs lg:text-sm">Search Categories</span>
              </label>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Search by title..."
                  className="input input-bordered input-sm lg:input-md flex-1"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="btn btn-square btn-sm lg:btn-md">
                  <FaSearch />
                </span>
              </div>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text text-xs lg:text-sm">Status Filter</span>
              </label>
              <select
                className="select select-bordered select-sm lg:select-md w-full"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-3 lg:p-6">
          <h3 className="card-title text-base lg:text-lg">
            Categories ({filteredCategories.length} of {categories.length})
          </h3>
          
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8 text-base-content/60">
              <p>No categories found matching your criteria</p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {filteredCategories.map((category) => (
                  <div key={category._id} className="card bg-base-200 p-3">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{category.title}</h4>
                        <p className="text-xs opacity-70">ID: {category._id.slice(-8)}</p>
                        <div className="mt-2">
                          {getStatusBadge(category.isActive)}
                        </div>
                        <p className="text-xs mt-1">
                          Created: {new Date(category.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          className="btn btn-ghost btn-xs"
                          onClick={() => handleEditCategory(category)}
                          title="Edit Category"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-ghost btn-xs text-error hover:text-error"
                          onClick={() => handleDeleteCategory(category)}
                          disabled={isDeleting}
                          title="Delete Category"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCategories.map((category) => (
                      <tr key={category._id}>
                        <td>
                          <div className="font-semibold">{category.title}</div>
                          <div className="text-sm opacity-70">ID: {category._id.slice(-8)}</div>
                        </td>
                        <td>{getStatusBadge(category.isActive)}</td>
                        <td>
                          <div className="text-sm">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs opacity-70">
                            {new Date(category.createdAt).toLocaleTimeString()}
                          </div>
                        </td>
                        <td>
                          <div className="flex gap-2">
                            <button
                              className="btn btn-ghost btn-sm"
                              onClick={() => handleEditCategory(category)}
                              title="Edit Category"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="btn btn-ghost btn-sm text-error hover:text-error"
                              onClick={() => handleDeleteCategory(category)}
                              disabled={isDeleting}
                              title="Delete Category"
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
            </>
          )}
        </div>
      </div>

      {/* Category Modal */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleModalSuccess}
        category={selectedCategory}
        mode={modalMode}
      />
    </div>
  );
};

export default CategoryManagement;
