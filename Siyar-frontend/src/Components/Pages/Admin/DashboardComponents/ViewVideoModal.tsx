import React from 'react';
import type { IVideo } from '../../../../Redux/api/videoApi';
import { FaTimes, FaPlay, FaStar, FaEye, FaEyeSlash, FaEyeDropper, FaCalendar, FaClock } from 'react-icons/fa';

interface ViewVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video?: IVideo;
}

const ViewVideoModal: React.FC<ViewVideoModalProps> = ({ isOpen, onClose, video }) => {
  if (!isOpen || !video) return null;

  const getStatusBadge = (status: IVideo['status']) => {
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
  };

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    // YouTube short
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }
    // Vimeo
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }
    return null;
  };

  const embedUrl = getVideoEmbedUrl(video.videoLink);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[95vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-info to-info-focus text-info-content p-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">{video.title}</h2>
              <div className="flex items-center gap-3 text-sm">
                {getStatusBadge(video.status)}
                {video.isFeatured && (
                  <span className="badge badge-warning gap-1">
                    <FaStar />
                    Featured
                  </span>
                )}
              </div>
            </div>
            <button onClick={onClose} className="btn btn-ghost btn-circle text-info-content hover:bg-info-focus">
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(95vh-96px)] space-y-6">
          {/* Video Player */}
          <div className="w-full">
            {embedUrl ? (
              <div className="aspect-video w-full">
                <iframe
                  src={embedUrl}
                  className="w-full h-full rounded-xl shadow-lg"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              </div>
            ) : (
              <div className="aspect-video w-full bg-base-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <FaPlay className="text-6xl text-base-content/30 mx-auto mb-4" />
                  <p className="text-lg font-medium text-base-content/70">Video Preview Not Available</p>
                  <p className="text-sm text-base-content/50 mt-2">Direct link: {video.videoLink}</p>
                </div>
              </div>
            )}
          </div>

          {/* Video Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Info */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg flex items-center gap-2">
                  <FaPlay className="text-info" />
                  Video Information
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold">Title:</span>
                    <p className="mt-1">{video.title}</p>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Video Link:</span>
                    <p className="mt-1 break-all text-sm opacity-80">
                      <a 
                        href={video.videoLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-info hover:underline"
                      >
                        {video.videoLink}
                      </a>
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Status:</span>
                    <div className="mt-1">{getStatusBadge(video.status)}</div>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Featured:</span>
                    <div className="mt-1">
                      {video.isFeatured ? (
                        <span className="badge badge-warning gap-1">
                          <FaStar />
                          Yes
                        </span>
                      ) : (
                        <span className="badge badge-neutral">No</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats & Metadata */}
            <div className="card bg-base-200 shadow-lg">
              <div className="card-body">
                <h3 className="card-title text-lg flex items-center gap-2">
                  <FaClock className="text-info" />
                  Statistics & Metadata
                </h3>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-semibold">Views:</span>
                    <p className="mt-1 text-2xl font-bold text-info">
                      {video.views?.toLocaleString() || 0}
                    </p>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Created:</span>
                    <div className="mt-1 flex items-center gap-2">
                      <FaCalendar className="text-info" />
                      <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Last Updated:</span>
                    <div className="mt-1 flex items-center gap-2">
                      <FaClock className="text-info" />
                      <span>{new Date(video.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-semibold">Video ID:</span>
                    <p className="mt-1 font-mono text-xs bg-base-300 p-2 rounded">
                      {video._id}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-center gap-4 pt-4">
            <button
              className="btn btn-info btn-outline"
              onClick={() => window.open(video.videoLink, '_blank')}
            >
              <FaPlay />
              Open Video
            </button>
            
            <button
              className="btn btn-primary"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewVideoModal;
