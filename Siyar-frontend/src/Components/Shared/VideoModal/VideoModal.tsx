import React, { useEffect } from 'react';
import { FaTimes, FaPlay, FaEye, FaCalendarAlt } from 'react-icons/fa';
import type { IVideo } from '../../../Redux/api/videoApi';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: IVideo | null;
}

function extractYouTubeId(url: string): string {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) {
      return u.pathname.slice(1);
    }
    if (u.searchParams.get('v')) {
      return u.searchParams.get('v') || '';
    }
    // Fallback for embed links
    const parts = u.pathname.split('/');
    return parts[parts.length - 1];
  } catch {
    return url;
  }
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose, video }) => {
  // Handle ESC key press (only on non-mobile devices)
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      // Only handle ESC key on non-mobile devices (screen width > 768px)
      if (event.key === 'Escape' && window.innerWidth > 768) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !video) return null;

  const videoId = extractYouTubeId(video.videoLink);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="relative bg-gradient-to-r from-[#03045E] to-[#0054FF] p-6">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center text-white"
            >
              <FaTimes size={20} />
            </button>
            
            <div className="flex items-center gap-3 text-white">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <FaPlay size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Watch Video</h2>
                <p className="text-white/80 text-sm">Enjoy this video content</p>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            <iframe
              title={video.title}
              src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&autoplay=1`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>

          {/* Video Details */}
          <div className="p-6">
            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#03045E] uppercase leading-tight mb-4">
              {video.title}
            </h1>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 mb-6 text-gray-600">
              {video.views && (
                <div className="flex items-center gap-2">
                  <FaEye className="text-[#0054FF]" />
                  <span className="font-medium">{video.views.toLocaleString()} views</span>
                </div>
              )}
              
              <div className="flex items-center gap-2">
                <FaCalendarAlt className="text-[#0054FF]" />
                <span className="font-medium">
                  {new Date(video.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>

              {video.isFeatured && (
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  Featured
                </div>
              )}

              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                video.status === 'published' ? 'bg-green-100 text-green-800' :
                video.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}>
                {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
              </div>
            </div>

                         {/* Action Buttons - Removed as requested */}
          </div>

                     {/* Footer */}
           <div className="bg-gray-50 px-6 py-4 border-t">
             <p className="text-center text-gray-500 text-sm">
               <span className="hidden md:inline">
                 Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">ESC</kbd> to close or 
               </span>
               click outside the modal to close
             </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
