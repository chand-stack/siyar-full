import React from 'react';
import { useGetArticlesQuery } from '../../../../Redux/api/articleApi';
import { useGetCategoriesQuery } from '../../../../Redux/api/categoryApi';
import { useGetSeriesQuery } from '../../../../Redux/api/seriesApi';
import { useGetVideosQuery } from '../../../../Redux/api/videoApi';
import { useGetImagesQuery } from '../../../../Redux/api/imageApi';
import type { IArticle } from '../../../../Redux/api/articleApi';
import { FaNewspaper, FaCheckCircle, FaEdit, FaEye, FaStar, FaClock, FaFolder, FaBook, FaPlay, FaUsers, FaChartLine, FaImage } from 'react-icons/fa';

type DashboardSection = 'overview' | 'articles' | 'categories' | 'series' | 'videos' | 'images';

interface DashboardOverviewProps {
  onNavigateToSection: (section: DashboardSection) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigateToSection }) => {
  // Fetch data for all sections
  const { data: allArticles } = useGetArticlesQuery({ limit: 1000 });
  const { data: allCategories } = useGetCategoriesQuery({});
  const { data: allSeries } = useGetSeriesQuery({});
  const { data: allVideos } = useGetVideosQuery({ limit: 1000 });
  const { data: allImages } = useGetImagesQuery();
  
  const articles = allArticles?.data?.items || [];
  const categories = allCategories?.data || [];
  const series = allSeries?.data || [];
  const videos = allVideos?.data?.items || [];
  const images = allImages?.data || [];

  // Articles statistics
  const totalArticles = allArticles?.data?.total || 0;
  const publishedArticles = articles.filter((a: IArticle) => a.status === 'published').length;
  const draftArticles = articles.filter((a: IArticle) => a.status === 'draft').length;
  const featuredArticles = articles.filter((a: IArticle) => a.isFeatured && a.status === 'published').length;
  const totalArticleViews = articles.reduce((sum: number, article: IArticle) => sum + (article.stats?.views || 0), 0);

  // Categories statistics
  const totalCategories = categories.length;

  // Series statistics
  const totalSeries = series.length;

  // Videos statistics
  const totalVideos = allVideos?.data?.total || 0;
  const publishedVideos = videos.filter(v => v.status === 'published').length;
  const draftVideos = videos.filter(v => v.status === 'draft').length;
  const featuredVideos = videos.filter(v => v.isFeatured).length;
  const totalVideoViews = videos.reduce((sum, video) => sum + (video.views || 0), 0);

  // Images statistics
  const totalImages = images.length;
  const totalImageSize = images.reduce((sum, image) => sum + (image.fileSize || 0), 0);

  const stats = [
    // Content Overview
    { 
      title: 'Total Articles', 
      value: totalArticles.toString(), 
      change: '+12%', 
      icon: <FaNewspaper className="text-4xl" />, 
      color: 'blue',
      section: 'articles'
    },
    { 
      title: 'Total Videos', 
      value: totalVideos.toString(), 
      change: '+8%', 
      icon: <FaPlay className="text-4xl" />, 
      color: 'red',
      section: 'videos'
    },
    { 
      title: 'Total Categories', 
      value: totalCategories.toString(), 
      change: '+5%', 
      icon: <FaFolder className="text-4xl" />, 
      color: 'green',
      section: 'categories'
    },
    { 
      title: 'Total Series', 
      value: totalSeries.toString(), 
      change: '+3%', 
      icon: <FaBook className="text-4xl" />, 
      color: 'purple',
      section: 'series'
    },
    { 
      title: 'Total Images', 
      value: totalImages.toString(), 
      change: '+15%', 
      icon: <FaImage className="text-4xl" />, 
      color: 'cyan',
      section: 'images'
    },
    
    // Published Content
    { 
      title: 'Published Articles', 
      value: publishedArticles.toString(), 
      change: '+8%', 
      icon: <FaCheckCircle className="text-4xl" />, 
      color: 'emerald',
      section: 'articles'
    },
    { 
      title: 'Published Videos', 
      value: publishedVideos.toString(), 
      change: '+6%', 
      icon: <FaCheckCircle className="text-4xl" />, 
      color: 'emerald',
      section: 'videos'
    },
    
    // Featured Content
    { 
      title: 'Featured Articles', 
      value: featuredArticles.toString(), 
      change: '+2%', 
      icon: <FaStar className="text-4xl" />, 
      color: 'amber',
      section: 'articles'
    },
    { 
      title: 'Featured Videos', 
      value: featuredVideos.toString(), 
      change: '+1%', 
      icon: <FaStar className="text-4xl" />, 
      color: 'amber',
      section: 'videos'
    },
    
    // Engagement
    { 
      title: 'Article Views', 
      value: totalArticleViews.toLocaleString(), 
      change: '+23%', 
      icon: <FaEye className="text-4xl" />, 
      color: 'indigo',
      section: 'articles'
    },
    { 
      title: 'Video Views', 
      value: totalVideoViews.toLocaleString(), 
      change: '+18%', 
      icon: <FaEye className="text-4xl" />, 
      color: 'pink',
      section: 'videos'
    },
    
    // Drafts
    { 
      title: 'Draft Articles', 
      value: draftArticles.toString(), 
      change: '-3%', 
      icon: <FaEdit className="text-4xl" />, 
      color: 'yellow',
      section: 'articles'
    },
    { 
      title: 'Draft Videos', 
      value: draftVideos.toString(), 
      change: '-2%', 
      icon: <FaEdit className="text-4xl" />, 
      color: 'yellow',
      section: 'videos'
    },
    
    // Storage
    { 
      title: 'Image Storage', 
      value: `${(totalImageSize / (1024 * 1024)).toFixed(1)}MB`, 
      change: '+25%', 
      icon: <FaImage className="text-4xl" />, 
      color: 'orange',
      section: 'images'
    },
  ];

  const recentActivities = [
    { action: 'New article published', user: 'Admin User', time: '2 hours ago', type: 'publish', section: 'articles' },
    { action: 'Video uploaded', user: 'Content Manager', time: '3 hours ago', type: 'upload', section: 'videos' },
    { action: 'Category updated', user: 'Editor', time: '4 hours ago', type: 'update', section: 'categories' },
    { action: 'Series created', user: 'Admin User', time: '6 hours ago', type: 'create', section: 'series' },
    { action: 'Article edited', user: 'Content Manager', time: '8 hours ago', type: 'edit', section: 'articles' },
    { action: 'Video featured', user: 'Admin User', time: '1 day ago', type: 'feature', section: 'videos' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'publish': return '📤';
      case 'upload': return '📹';
      case 'update': return '✏️';
      case 'create': return '➕';
      case 'edit': return '📝';
      case 'feature': return '⭐';
      case 'settings': return '⚙️';
      default: return '📋';
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'publish': return '#10b981';
      case 'upload': return '#ef4444';
      case 'update': return '#f59e0b';
      case 'create': return '#8b5cf6';
      case 'edit': return '#8b5cf6';
      case 'feature': return '#f59e0b';
      case 'settings': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'articles': return 'text-blue-500';
      case 'videos': return 'text-red-500';
      case 'categories': return 'text-green-500';
      case 'series': return 'text-purple-500';
      case 'images': return 'text-cyan-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="card bg-gradient-to-r from-primary to-primary-focus text-primary-content shadow-xl">
        <div className="card-body text-center p-4 lg:p-6">
          <h1 className="text-2xl lg:text-4xl font-bold mb-2">🎉 Welcome to Siyar Admin Dashboard</h1>
          <p className="text-base lg:text-xl opacity-90">Manage your content, track performance, and grow your platform</p>
          <div className="flex flex-wrap justify-center gap-2 lg:gap-4 mt-4">
            <div className="badge badge-secondary badge-lg">📊 {totalArticles + totalVideos} Total Content</div>
            <div className="badge badge-accent badge-lg">🖼️ {totalImages} Images</div>
            <div className="badge badge-info badge-lg">📈 Growing Platform</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
            onClick={() => onNavigateToSection(stat.section as DashboardSection)}
            title={`Go to ${stat.section.charAt(0).toUpperCase() + stat.section.slice(1)} section`}
          >
            <div className="card-body p-3 lg:p-6">
              <div className="flex items-center gap-2 lg:gap-4">
                <div className={`${getSectionColor(stat.section)} group-hover:scale-110 transition-transform`}>
                  <span className="text-2xl lg:text-4xl">{stat.icon}</span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xs lg:text-sm font-semibold text-base-content/70 uppercase tracking-wide">{stat.title}</h3>
                  <div className="text-lg lg:text-2xl font-bold mt-1">{stat.value}</div>
                  <div className="badge badge-success badge-xs lg:badge-sm mt-2">{stat.change}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content Overview Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4 lg:p-6">
            <h3 className="card-title flex items-center gap-2 text-base lg:text-lg">
              <FaChartLine className="text-primary" />
              Content Distribution
            </h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm font-medium">Articles</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 lg:w-32 bg-base-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(totalArticles / (totalArticles + totalVideos)) * 100}%` }}></div>
                  </div>
                  <span className="text-xs lg:text-sm font-bold">{totalArticles}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm font-medium">Videos</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 lg:w-32 bg-base-200 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(totalVideos / (totalArticles + totalVideos)) * 100}%` }}></div>
                  </div>
                  <span className="text-xs lg:text-sm font-bold">{totalVideos}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm font-medium">Categories</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 lg:w-32 bg-base-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(totalCategories / Math.max(totalCategories + totalSeries, 1)) * 100}%` }}></div>
                  </div>
                  <span className="text-xs lg:text-sm font-bold">{totalCategories}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm font-medium">Series</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 lg:w-32 bg-base-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(totalSeries / Math.max(totalCategories + totalSeries, 1)) * 100}%` }}></div>
                  </div>
                  <span className="text-xs lg:text-sm font-bold">{totalSeries}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs lg:text-sm font-medium">Images</span>
                <div className="flex items-center gap-2">
                  <div className="w-20 lg:w-32 bg-base-200 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{ width: `${(totalImages / Math.max(totalArticles + totalVideos + totalImages, 1)) * 100}%` }}></div>
                  </div>
                  <span className="text-xs lg:text-sm font-bold">{totalImages}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-4 lg:p-6">
            <h3 className="card-title flex items-center gap-2 text-base lg:text-lg">
              <FaUsers className="text-primary" />
              Engagement Overview
            </h3>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-center justify-between p-2 lg:p-3 bg-blue-50 rounded-lg">
                <span className="text-xs lg:text-sm font-medium text-blue-700">Article Views</span>
                <span className="text-sm lg:text-lg font-bold text-blue-700">{totalArticleViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 lg:p-3 bg-red-50 rounded-lg">
                <span className="text-xs lg:text-sm font-medium text-red-700">Video Views</span>
                <span className="text-sm lg:text-lg font-bold text-red-700">{totalVideoViews.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 lg:p-3 bg-green-50 rounded-lg">
                <span className="text-xs lg:text-sm font-medium text-green-700">Published Content</span>
                <span className="text-sm lg:text-lg font-bold text-green-700">{publishedArticles + publishedVideos}</span>
              </div>
              <div className="flex items-center justify-between p-2 lg:p-3 bg-amber-50 rounded-lg">
                <span className="text-xs lg:text-sm font-medium text-amber-700">Featured Content</span>
                <span className="text-sm lg:text-lg font-bold text-amber-700">{featuredArticles + featuredVideos}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-4 lg:p-6">
          <h3 className="card-title flex items-center gap-2 text-base lg:text-lg">
            <FaClock className="text-primary" />
            Recent Activities
          </h3>
          <div className="space-y-3 lg:space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-2 lg:gap-4 p-2 lg:p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
                <div 
                  className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg flex items-center justify-center text-white text-sm lg:text-lg flex-shrink-0"
                  style={{ backgroundColor: getActivityColor(activity.type) }}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs lg:text-sm truncate">{activity.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-base-content/70 truncate">{activity.user}</p>
                    <span className={`badge badge-xs ${getSectionColor(activity.section)} flex-shrink-0`}>
                      {activity.section.charAt(0).toUpperCase() + activity.section.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="text-xs text-base-content/50 flex-shrink-0">{activity.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body p-4 lg:p-6">
          <h3 className="card-title flex items-center gap-2 text-base lg:text-lg">
            <FaEdit className="text-primary" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 lg:gap-4">
            <button 
              className="btn btn-outline btn-sm lg:btn-lg flex-col h-20 lg:h-24 hover:btn-primary transition-colors"
              onClick={() => onNavigateToSection('articles')}
              title="Go to Articles section to create new articles"
            >
              <span className="text-xl lg:text-2xl">📝</span>
              <span className="text-xs lg:text-sm">Create Article</span>
            </button>
            <button 
              className="btn btn-outline btn-sm lg:btn-lg flex-col h-20 lg:h-24 hover:btn-primary transition-colors"
              onClick={() => onNavigateToSection('videos')}
              title="Go to Videos section to upload new videos"
            >
              <span className="text-xl lg:text-2xl">🎥</span>
              <span className="text-xs lg:text-sm">Upload Video</span>
            </button>
            <button 
              className="btn btn-outline btn-sm lg:btn-lg flex-col h-20 lg:h-24 hover:btn-primary transition-colors"
              onClick={() => onNavigateToSection('categories')}
              title="Go to Categories section to add new categories"
            >
              <span className="text-xl lg:text-2xl">📁</span>
              <span className="text-xs lg:text-sm">Add Category</span>
            </button>
            <button 
              className="btn btn-outline btn-sm lg:btn-lg flex-col h-20 lg:h-24 hover:btn-primary transition-colors"
              onClick={() => onNavigateToSection('series')}
              title="Go to Series section to create new series"
            >
              <span className="text-xl lg:text-2xl">📚</span>
              <span className="text-xs lg:text-sm">Create Series</span>
            </button>
            <button 
              className="btn btn-outline btn-sm lg:btn-lg flex-col h-20 lg:h-24 hover:btn-primary transition-colors"
              onClick={() => onNavigateToSection('images')}
              title="Go to Images section to upload new images"
            >
              <span className="text-xl lg:text-2xl">🖼️</span>
              <span className="text-xs lg:text-sm">Upload Images</span>
            </button>
          </div>
          
          {/* Additional Navigation Actions */}
          <div className="divider my-4"></div>
          <div className="flex justify-center">
            <button 
              className="btn btn-secondary btn-sm lg:btn-lg"
              onClick={() => window.location.href = '/'}
              title="Go to Home Page"
            >
              <span className="text-xl lg:text-2xl">🏠</span>
              <span className="ml-2 lg:ml-3">Go to Home Page</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
