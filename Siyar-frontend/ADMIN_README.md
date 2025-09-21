# Siyar Admin Dashboard

A comprehensive admin dashboard for managing the Siyar blog platform.

## Features

### 🔐 Authentication System
- Secure login with email/password
- JWT token-based authentication
- Automatic token refresh
- Protected admin routes

### 📊 Dashboard Overview
- Real-time statistics and metrics
- Recent activity tracking
- Quick action buttons
- Visual data representation

### 📝 Article Management
- Create, edit, and delete articles
- Article status management (Published, Draft, Archived)
- Featured article controls
- Search and filter functionality
- Bulk operations

### 📁 Category Management
- Organize content into categories
- Category color coding
- Article count tracking
- Category status management

### 👥 User Management
- User role management (Admin, Editor, Author)
- User status controls
- Registration and login tracking
- Permission management

### ⚙️ Site Settings
- General site configuration
- Content settings
- Comment moderation
- Feature toggles
- Maintenance mode

## Routes

- `/admin` - Admin login page
- `/admin/dashboard` - Main admin dashboard (requires authentication)

## Backend API Endpoints

The admin system expects the following backend endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - User logout

### Articles
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Backend URL**
   Update the `baseUrl` in `src/Redux/api/baseApi.ts` to match your backend server.

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Access Admin Panel**
   Navigate to `/admin` in your browser.

## Authentication Flow

1. User visits `/admin`
2. Enters credentials (email/password)
3. Backend validates credentials and returns JWT tokens
4. Frontend stores tokens in Redux store and localStorage
5. User is redirected to `/admin/dashboard`
6. All subsequent API calls include the access token
7. Token refresh happens automatically when needed

## Security Features

- JWT token authentication
- Automatic token refresh
- Protected routes
- Secure cookie handling
- Role-based access control

## Responsive Design

The admin dashboard is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## Customization

### Adding New Dashboard Sections
1. Create a new component in `DashboardComponents/`
2. Add it to the `AdminDashboard.tsx` component
3. Update the navigation menu
4. Add corresponding styles

### Modifying API Calls
1. Update the relevant API slice in `Redux/api/`
2. Modify the component to use the new API endpoints
3. Update error handling and loading states

### Styling Changes
1. Modify the CSS files in each component
2. Update the main dashboard styles
3. Ensure responsive design is maintained

## Troubleshooting

### Common Issues

1. **Authentication Failed**
   - Check backend server is running
   - Verify API endpoints are correct
   - Check browser console for errors

2. **Token Refresh Issues**
   - Verify refresh token is valid
   - Check cookie settings
   - Ensure backend handles refresh properly

3. **API Calls Failing**
   - Check network tab for failed requests
   - Verify authorization headers
   - Check backend CORS settings

### Debug Mode

Enable debug logging by setting `localStorage.debug = 'true'` in the browser console.

## Contributing

1. Follow the existing code structure
2. Maintain responsive design
3. Add proper error handling
4. Include loading states
5. Test on multiple devices

## License

This project is part of the Siyar blog platform.
