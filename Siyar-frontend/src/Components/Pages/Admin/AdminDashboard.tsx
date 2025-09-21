import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import type { RootState } from '../../../Redux/store';
import { logout } from '../../../Redux/slices/authSlice';
import { useLogoutMutation } from '../../../Redux/api/authApi';

// Dashboard components
import {
  DashboardOverview,
  ArticleManagement,
  CategoryManagement,
  SeriesManagement,
  VideoManagement,
  NewsletterManagement,
  ContactManagement
} from './DashboardComponents';
import CompleteImageManager from './DashboardComponents/CompleteImageManager';

type DashboardSection = 'overview' | 'articles' | 'categories' | 'series' | 'videos' | 'images' | 'newsletter' | 'contacts';

const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  
  const [logoutApi] = useLogoutMutation();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
      dispatch(logout());
      navigate('/admin');
    } catch (error) {
      console.error('Logout failed:', error);
      // Force logout even if API call fails
      dispatch(logout());
      navigate('/admin');
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <DashboardOverview onNavigateToSection={setActiveSection} />;
      case 'articles':
        return <ArticleManagement />;
      case 'categories':
        return <CategoryManagement />;
      case 'series':
        return <SeriesManagement />;
      case 'videos':
        return <VideoManagement />;
      case 'images':
        return <CompleteImageManager />;
      case 'newsletter':
        return <NewsletterManagement />;
      case 'contacts':
        return <ContactManagement />;
      default:
        return <DashboardOverview onNavigateToSection={setActiveSection} />;
    }
  };

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'articles', label: 'Articles', icon: '📝' },
    { id: 'categories', label: 'Categories', icon: '📁' },
    { id: 'series', label: 'Series', icon: '📚' },
    { id: 'videos', label: 'Videos', icon: '🎥' },
    { id: 'images', label: 'Images', icon: '🖼️' },
    { id: 'newsletter', label: 'Newsletter', icon: '📧' },
    { id: 'contacts', label: 'Contacts', icon: '💬' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-base-200">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          className="btn btn-primary btn-circle"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
        >
          {mobileSidebarOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        bg-base-300 shadow-lg transition-all duration-300
        lg:static lg:translate-x-0
        ${mobileSidebarOpen ? 'fixed inset-y-0 left-0 z-40 translate-x-0 w-64' : 'fixed inset-y-0 left-0 z-40 -translate-x-full w-64 lg:translate-x-0'}
        ${sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
      `}>
        <div className="p-4 border-b border-base-content/10">
          <div className="flex items-center justify-between">
            {(!sidebarCollapsed || window.innerWidth < 1024) && (
              <h2 className="text-xl font-bold text-primary">Siyar Admin</h2>
            )}
            <button
              className="btn btn-ghost btn-sm hidden lg:block"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? '→' : '←'}
            </button>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {/* Go to Home Button */}
          <button
            className="btn w-full justify-start btn-outline btn-secondary"
            onClick={() => navigate('/')}
            title="Go to Home Page"
          >
            <span className="text-lg">🏠</span>
            {(!sidebarCollapsed || window.innerWidth < 1024) && (
              <span className="ml-3">Go to Home</span>
            )}
          </button>
          
          <div className="divider my-2"></div>
          
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`btn w-full justify-start ${activeSection === item.id ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => {
                setActiveSection(item.id as DashboardSection);
                // Close mobile sidebar after navigation
                if (window.innerWidth < 1024) {
                  setMobileSidebarOpen(false);
                }
              }}
            >
              <span className="text-lg">{item.icon}</span>
              {(!sidebarCollapsed || window.innerWidth < 1024) && (
                <span className="ml-3">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-base-content/10 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="avatar placeholder">
              <div className="bg-primary text-primary-content rounded-full w-10">
                <span className="text-lg font-bold">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
              </div>
            </div>
            {(!sidebarCollapsed || window.innerWidth < 1024) && (
              <div className="flex-1">
                <p className="font-semibold text-sm">{user?.name || 'Admin'}</p>
                <p className="text-xs opacity-70">{user?.role || 'Administrator'}</p>
              </div>
            )}
          </div>
          <button className="btn btn-error btn-sm w-full" onClick={handleLogout}>
            {(!sidebarCollapsed || window.innerWidth < 1024) && 'Logout'}
            <span className="text-lg">🚪</span>
          </button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="bg-base-100 shadow-sm border-b border-base-content/10">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl lg:text-2xl font-bold">
              {menuItems.find(item => item.id === activeSection)?.label || 'Dashboard'}
            </h1>
            <div className="flex items-center gap-2 lg:gap-4">
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => navigate('/')}
                title="Go to Home Page"
              >
                <span className="text-lg">🏠</span>
                <span className="ml-2 hidden sm:inline">Home</span>
              </button>
              <div className="indicator">
                <button className="btn btn-ghost btn-circle">
                  🔔
                </button>
                <span className="indicator-item badge badge-primary badge-sm">3</span>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 p-3 lg:p-6 overflow-auto">
          {renderSection()}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
