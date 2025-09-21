import React, { useState } from 'react';


const Settings: React.FC = () => {
  const [settings, setSettings] = useState({
    siteName: 'Siyar Blog',
    siteDescription: 'A modern blog platform for sharing knowledge and insights',
    siteUrl: 'https://siyar-blog.com',
    adminEmail: 'admin@siyar-blog.com',
    postsPerPage: 10,
    allowComments: true,
    moderateComments: true,
    enableNewsletter: true,
    maintenanceMode: false,
    analyticsEnabled: true
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically save the settings to the backend
    console.log('Settings saved:', settings);
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-4 lg:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl lg:text-2xl font-bold">Site Settings</h2>
        <button className="btn btn-primary btn-sm lg:btn-md w-full sm:w-auto" onClick={handleSubmit}>
          <span>💾</span>
          Save Settings
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
        {/* General Settings */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-3 lg:p-6">
            <h3 className="card-title text-base lg:text-lg">General Settings</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-xs lg:text-sm">Site Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered input-sm lg:input-md"
                  name="siteName"
                  value={settings.siteName}
                  onChange={handleInputChange}
                  placeholder="Enter site name"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-xs lg:text-sm">Site Description</span>
                </label>
                <textarea
                  className="textarea textarea-bordered textarea-sm lg:textarea-md"
                  name="siteDescription"
                  value={settings.siteDescription}
                  onChange={handleInputChange}
                  placeholder="Enter site description"
                  rows={3}
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-xs lg:text-sm">Site URL</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered input-sm lg:input-md"
                  name="siteUrl"
                  value={settings.siteUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com"
                />
              </div>
              
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-xs lg:text-sm">Admin Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered input-sm lg:input-md"
                  name="adminEmail"
                  value={settings.adminEmail}
                  onChange={handleInputChange}
                  placeholder="admin@example.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Content Settings */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-3 lg:p-6">
            <h3 className="card-title text-base lg:text-lg">Content Settings</h3>
            <div className="form-control w-full max-w-xs">
              <label className="label">
                <span className="label-text font-semibold text-xs lg:text-sm">Posts Per Page</span>
              </label>
              <select
                className="select select-bordered select-sm lg:select-md"
                name="postsPerPage"
                value={settings.postsPerPage}
                onChange={handleInputChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
                <option value={25}>25</option>
              </select>
            </div>
          </div>
        </div>

        {/* Comment Settings */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-3 lg:p-6">
            <h3 className="card-title text-base lg:text-lg">Comment Settings</h3>
            <div className="space-y-3 lg:space-y-4">
              <label className="label cursor-pointer">
                <span className="label-text text-xs lg:text-sm">Allow comments on articles</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm lg:toggle-md"
                  name="allowComments"
                  checked={settings.allowComments}
                  onChange={handleInputChange}
                />
              </label>
              
              <label className="label cursor-pointer">
                <span className="label-text text-xs lg:text-sm">Moderate comments before publishing</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm lg:toggle-md"
                  name="moderateComments"
                  checked={settings.moderateComments}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Feature Settings */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body p-3 lg:p-6">
            <h3 className="card-title text-base lg:text-lg">Feature Settings</h3>
            <div className="space-y-3 lg:space-y-4">
              <label className="label cursor-pointer">
                <span className="label-text text-xs lg:text-sm">Enable newsletter subscription</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm lg:toggle-md"
                  name="enableNewsletter"
                  checked={settings.enableNewsletter}
                  onChange={handleInputChange}
                />
              </label>
              
              <label className="label cursor-pointer">
                <span className="label-text text-xs lg:text-sm">Enable maintenance mode</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm lg:toggle-md"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleInputChange}
                />
              </label>
              
              <label className="label cursor-pointer">
                <span className="label-text text-xs lg:text-sm">Enable analytics tracking</span>
                <input
                  type="checkbox"
                  className="toggle toggle-primary toggle-sm lg:toggle-md"
                  name="analyticsEnabled"
                  checked={settings.analyticsEnabled}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card bg-error/10 border-error shadow-lg">
          <div className="card-body p-3 lg:p-6">
            <h3 className="card-title text-error text-base lg:text-lg">Danger Zone</h3>
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4 flex-wrap">
              <button type="button" className="btn btn-error btn-sm lg:btn-md w-full sm:w-auto">
                <span>🗑️</span>
                Clear All Data
              </button>
              <button type="button" className="btn btn-warning btn-sm lg:btn-md w-full sm:w-auto">
                <span>⚠️</span>
                Reset to Defaults
              </button>
              <button type="button" className="btn btn-error btn-sm lg:btn-md w-full sm:w-auto">
                <span>🚫</span>
                Delete Site
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Settings;
