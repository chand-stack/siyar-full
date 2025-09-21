import React, { useState } from 'react';
import { useGetVideosQuery, useDeleteVideoMutation, useUpdateVideoMutation, useSetVideoAsFeaturedMutation } from '../../../../Redux/api/videoApi';
import type { IVideo } from '../../../../Redux/api/videoApi';
import { FaEdit, FaTrash, FaEye, FaStar, FaPlay, FaPlus, FaEyeSlash } from 'react-icons/fa';
import CreateVideoModal from './CreateVideoModal';
import EditVideoModal from './EditVideoModal';
import ViewVideoModal from './ViewVideoModal';
import Swal from 'sweetalert2';

const VideoManagement: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<IVideo['status'] | ''>('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<IVideo | undefined>(undefined);

  // Fetch videos from API
  const { data: videosResponse, isLoading, error } = useGetVideosQuery({
    page: currentPage,
    limit: 20,
    ...(statusFilter && { status: statusFilter }),
  });

  const [deleteVideo] = useDeleteVideoMutation();
  const [updateVideo] = useUpdateVideoMutation();
  const [setVideoAsFeatured] = useSetVideoAsFeaturedMutation();

  const videos = videosResponse?.data?.items || [];
  const totalVideos = videosResponse?.data?.total || 0;
  const totalPages = Math.ceil(totalVideos / 20);

  // Filter videos based on search term
  const filteredVideos = videos.filter((video) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return video.title.toLowerCase().includes(searchLower);
  });

  // Helper to safely extract an error message without using any
  function extractErrorMessage(error: unknown, fallback: string): string {
    if (typeof error === 'string') return error;
    if (error && typeof error === 'object') {
      const maybeData = (error as { data?: unknown }).data;
      if (maybeData && typeof maybeData === 'object' && 'message' in maybeData) {
        const msg = (maybeData as { message?: unknown }).message;
        if (typeof msg === 'string') return msg;
      }
      if ('message' in error) {
        const msg = (error as { message?: unknown }).message;
        if (typeof msg === 'string') return msg;
      }
    }
    return fallback;
  }

  const handleDeleteVideo = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this video? This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        const response = await deleteVideo(id).unwrap();
        
        if (response.success) {
          await Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Video has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(response.message || 'Failed to delete video');
        }
      } catch (error: unknown) {
        console.error('Failed to delete video:', error);
        const errorMessage = extractErrorMessage(error, 'Failed to delete video. Please try again.');
        
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: errorMessage,
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const handleToggleFeatured = async (video: IVideo) => {
    try {
      if (video.isFeatured) {
        // If already featured, unfeature it
        await updateVideo({
          id: video._id,
          data: { isFeatured: false }
        }).unwrap();
        
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Video removed from featured successfully.',
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        // If not featured, set it as featured (this will unfeature others)
        await setVideoAsFeatured(video._id).unwrap();
        
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Video set as featured successfully. Other videos have been unfeatured.',
          timer: 2000,
          showConfirmButton: false
        });
      }
    } catch (error: unknown) {
      console.error('Failed to update video featured status:', error);
      const errorMessage = extractErrorMessage(error, 'Failed to update video featured status. Please try again.');
      
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
  };

  const handleStatusChange = async (video: IVideo, newStatus: IVideo['status']) => {
    try {
      const response = await updateVideo({
        id: video._id,
        data: { status: newStatus }
      }).unwrap();
      
      if (response.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `Video status changed to ${newStatus} successfully.`,
          timer: 2000,
          showConfirmButton: false
        });
      } else {
        throw new Error(response.message || 'Failed to update video');
      }
    } catch (error: unknown) {
      console.error('Failed to update video status:', error);
      const errorMessage = extractErrorMessage(error, 'Failed to update video status. Please try again.');
      
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: errorMessage,
        confirmButtonText: 'OK'
      });
    }
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-xl lg:text-3xl font-bold text-primary">🎥 Video Management</h2>
          <p className="text-base-content/70 mt-1 text-sm lg:text-base">Manage your video content and featured videos</p>
        </div>
        <button 
          className="btn btn-primary btn-sm lg:btn-lg gap-2 w-full lg:w-auto"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <FaPlus />
          Add New Video
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <div className="stat bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl lg:rounded-2xl shadow-lg p-3 lg:p-6">
          <div className="stat-figure text-white">
            <FaPlay className="text-xl lg:text-3xl" />
          </div>
          <div className="stat-title text-white/90 text-xs lg:text-sm">Total Videos</div>
          <div className="stat-value text-white text-lg lg:text-3xl">{totalVideos}</div>
        </div>
        
        <div className="stat bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl lg:rounded-2xl shadow-lg p-3 lg:p-6">
          <div className="stat-figure text-white">
            <FaEye className="text-xl lg:text-3xl" />
          </div>
          <div className="stat-title text-white/90 text-xs lg:text-sm">Published</div>
          <div className="stat-value text-white text-lg lg:text-3xl">{videos.filter(v => v.status === 'published').length}</div>
        </div>
        
        <div className="stat bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-xl lg:rounded-2xl shadow-lg p-3 lg:p-6">
          <div className="stat-figure text-white">
            <FaEyeSlash className="text-xl lg:text-3xl" />
          </div>
          <div className="stat-title text-white/90 text-xs lg:text-sm">Drafts</div>
          <div className="stat-value text-white text-lg lg:text-3xl">{videos.filter(v => v.status === 'draft').length}</div>
        </div>
        
        <div className="stat bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl lg:rounded-2xl shadow-lg p-3 lg:p-6">
          <div className="stat-figure text-white">
            <FaStar className="text-xl lg:text-3xl" />
          </div>
          <div className="stat-title text-white/90 text-xs lg:text-sm">Featured</div>
          <div className="stat-value text-white text-lg lg:text-3xl">{videos.filter(v => v.isFeatured).length}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body p-3 lg:p-6">
          {/* Filters and Search */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 lg:mb-6">
            <h3 className="text-lg lg:text-xl font-semibold text-primary">
              All Videos ({filteredVideos.length} of {videos.length})
            </h3>
            
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-3 w-full lg:w-auto">
              <input
                type="text"
                placeholder="Search videos..."
                className="input input-bordered input-sm w-full sm:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              
              <select 
                className="select select-bordered select-sm w-full sm:w-auto"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as IVideo['status'] | '')}
              >
                <option value="">All Status</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
              
              <button
                type="button"
                className="btn btn-ghost btn-sm w-full sm:w-auto"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="flex flex-col items-center gap-3">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <p className="text-base font-medium">Loading videos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-error">
                <div className="flex flex-col items-center gap-3">
                  <FaEye className="text-3xl" />
                  <p className="text-base font-medium">Error loading videos. Please try again.</p>
                </div>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-8 text-base-content/70">
                <div className="flex flex-col items-center gap-3">
                  <FaPlay className="text-3xl opacity-50" />
                  <p className="text-base font-medium">No videos found matching your search criteria.</p>
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    <FaPlus />
                    Add Your First Video
                  </button>
                </div>
              </div>
            ) : (
              filteredVideos.map((video) => (
                <div key={video._id} className="card bg-base-200 p-4">
                  <div className="space-y-3">
                    {/* Video Info */}
                    <div className="flex items-start gap-3">
                      <div className="avatar flex-shrink-0">
                        <div className="w-12 h-9 bg-primary/20 rounded-lg flex items-center justify-center">
                          <FaPlay className="text-primary text-sm" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base">{video.title}</h4>
                        <p className="text-xs opacity-70 break-all">
                          {video.videoLink}
                        </p>
                      </div>
                    </div>

                    {/* Status and Views */}
                    <div className="flex justify-between items-center">
                      <select
                        className="select select-bordered select-xs"
                        value={video.status}
                        onChange={(e) => handleStatusChange(video, e.target.value as IVideo['status'])}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                      
                      <div className="text-center">
                        <span className="font-mono text-sm">{video.views || 0}</span>
                        <div className="text-xs opacity-70">views</div>
                      </div>
                    </div>

                    {/* Featured Toggle */}
                    <div className="flex justify-center">
                      <button
                        className={`btn btn-xs ${video.isFeatured ? 'btn-primary' : 'btn-ghost'}`}
                        onClick={() => handleToggleFeatured(video)}
                        title={video.isFeatured ? 'Click to unfeature' : 'Click to feature'}
                      >
                        <FaStar className={video.isFeatured ? 'text-yellow-400' : ''} />
                        {video.isFeatured ? 'Featured' : 'Feature'}
                      </button>
                    </div>

                    {/* Created Date */}
                    <div className="text-center text-xs">
                      <div className="font-medium">
                        {new Date(video.createdAt).toLocaleDateString()}
                      </div>
                      <div className="opacity-70">
                        {new Date(video.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2 border-t border-base-300">
                      <button 
                        className="btn btn-ghost btn-xs flex-1 text-info" 
                        title="View"
                        onClick={() => { setSelectedVideo(video); setIsViewModalOpen(true); }}
                      >
                        <FaEye />
                        <span className="ml-1">View</span>
                      </button>
                      
                      <button 
                        className="btn btn-ghost btn-xs flex-1 text-warning" 
                        title="Edit"
                        onClick={() => { setSelectedVideo(video); setIsEditModalOpen(true); }}
                      >
                        <FaEdit />
                        <span className="ml-1">Edit</span>
                      </button>
                      
                      <button 
                        className="btn btn-ghost btn-xs flex-1 text-error" 
                        title="Delete"
                        onClick={() => handleDeleteVideo(video._id)}
                      >
                        <FaTrash />
                        <span className="ml-1">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr className="bg-primary/10">
                  <th className="text-primary font-bold">Video</th>
                  <th className="text-primary font-bold">Status</th>
                  <th className="text-primary font-bold">Views</th>
                  <th className="text-primary font-bold">Featured</th>
                  <th className="text-primary font-bold">Created</th>
                  <th className="text-primary font-bold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center gap-3">
                        <span className="loading loading-spinner loading-lg text-primary"></span>
                        <p className="text-lg font-medium">Loading videos...</p>
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-error">
                      <div className="flex flex-col items-center gap-3">
                        <FaEye className="text-4xl" />
                        <p className="text-lg font-medium">Error loading videos. Please try again.</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredVideos.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-base-content/70">
                      <div className="flex flex-col items-center gap-3">
                        <FaPlay className="text-4xl opacity-50" />
                        <p className="text-lg font-medium">No videos found matching your search criteria.</p>
                        <button 
                          className="btn btn-primary btn-sm"
                          onClick={() => setIsCreateModalOpen(true)}
                        >
                          <FaPlus />
                          Add Your First Video
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredVideos.map((video) => (
                    <tr key={video._id} className="hover:bg-base-200 transition-colors">
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar">
                            <div className="w-16 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                              <FaPlay className="text-primary text-lg" />
                            </div>
                          </div>
                          <div>
                            <div className="font-bold text-lg">{video.title}</div>
                            <div className="text-sm opacity-70 break-all">
                              {video.videoLink}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <select
                          className="select select-bordered select-xs"
                          value={video.status}
                          onChange={(e) => handleStatusChange(video, e.target.value as IVideo['status'])}
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      
                      <td>
                        <div className="text-center">
                          <span className="font-mono text-lg">{video.views || 0}</span>
                          <div className="text-xs opacity-70">views</div>
                        </div>
                      </td>
                      
                      <td>
                        <button
                          className={`btn btn-sm ${video.isFeatured ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => handleToggleFeatured(video)}
                          title={video.isFeatured ? 'Click to unfeature' : 'Click to feature'}
                        >
                          <FaStar className={video.isFeatured ? 'text-yellow-400' : ''} />
                          {video.isFeatured ? 'Featured' : 'Feature'}
                        </button>
                      </td>
                      
                      <td>
                        <div className="text-sm">
                          <div className="font-medium">
                            {new Date(video.createdAt).toLocaleDateString()}
                          </div>
                          <div className="opacity-70">
                            {new Date(video.createdAt).toLocaleTimeString()}
                          </div>
                        </div>
                      </td>
                      
                      <td>
                        <div className="flex gap-2">
                          <button 
                            className="btn btn-ghost btn-sm text-info" 
                            title="View"
                            onClick={() => { setSelectedVideo(video); setIsViewModalOpen(true); }}
                          >
                            <FaEye />
                          </button>
                          
                          <button 
                            className="btn btn-ghost btn-sm text-warning" 
                            title="Edit"
                            onClick={() => { setSelectedVideo(video); setIsEditModalOpen(true); }}
                          >
                            <FaEdit />
                          </button>
                          
                          <button 
                            className="btn btn-ghost btn-sm text-error" 
                            title="Delete"
                            onClick={() => handleDeleteVideo(video._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 lg:mt-8">
              <div className="join">
                <button
                  className="join-item btn btn-xs lg:btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  «
                </button>
                
                {/* Show fewer page numbers on mobile */}
                {Array.from({ length: Math.min(window.innerWidth < 768 ? 3 : 5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - (window.innerWidth < 768 ? 2 : 4), currentPage - (window.innerWidth < 768 ? 1 : 2))) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      className={`join-item btn btn-xs lg:btn-sm ${currentPage === pageNum ? 'btn-active' : ''}`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  className="join-item btn btn-xs lg:btn-sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  »
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <CreateVideoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          // The API will automatically refetch due to cache invalidation
        }}
      />

      <EditVideoModal
        isOpen={isEditModalOpen}
        onClose={() => { setIsEditModalOpen(false); setSelectedVideo(undefined); }}
        onSuccess={() => { setIsEditModalOpen(false); setSelectedVideo(undefined); }}
        video={selectedVideo}
      />

      <ViewVideoModal
        isOpen={isViewModalOpen}
        onClose={() => { setIsViewModalOpen(false); setSelectedVideo(undefined); }}
        video={selectedVideo}
      />
    </div>
  );
};

export default VideoManagement;
