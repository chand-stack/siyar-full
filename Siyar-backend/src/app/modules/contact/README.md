# Contact Management Module

This module provides comprehensive CRUD operations for managing contact form submissions with admin status tracking.

## Features

- ✅ **Full CRUD Operations** - Create, Read, Update, Delete contacts
- ✅ **Status Management** - Track contact status (new, read, replied, closed, spam)
- ✅ **Admin Notes** - Add internal notes for contacts
- ✅ **Search Functionality** - Search contacts by email, name, subject, or message
- ✅ **Pagination** - Efficient pagination for large contact lists
- ✅ **Statistics** - Get contact statistics by status
- ✅ **Validation** - Input validation and sanitization
- ✅ **Timestamps** - Automatic tracking of reply and close times

## Data Structure

```typescript
interface IContact {
  email: string;           // Required, validated email
  name?: string;          // Optional, max 100 characters
  subject?: string;       // Optional, max 200 characters
  message?: string;       // Optional, max 2000 characters
  status: ContactStatus;  // new | read | replied | closed | spam
  adminNotes?: string;    // Optional, max 1000 characters
  repliedAt?: Date;       // Auto-set when status = "replied"
  closedAt?: Date;        // Auto-set when status = "closed"
  createdAt: Date;        // Auto-generated
  updatedAt: Date;        // Auto-generated
}
```

## API Endpoints

### Public Endpoints

#### Create Contact
**POST** `/api/contact/create-contact`

```json
{
  "email": "user@example.com",
  "name": "John Doe",
  "subject": "Inquiry about services",
  "message": "I would like to know more about your services..."
}
```

### Admin Endpoints

#### Get All Contacts
**GET** `/api/contact?page=1&limit=20&status=new`

Query Parameters:
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)
- `status` - Filter by status (new, read, replied, closed, spam)

#### Search Contacts
**GET** `/api/contact/search?search=john&page=1&limit=20`

Query Parameters:
- `search` - Search term (searches email, name, subject, message)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

#### Get Contact by ID
**GET** `/api/contact/:id`

#### Update Contact
**PATCH** `/api/contact/:id`

```json
{
  "name": "Updated Name",
  "subject": "Updated Subject",
  "message": "Updated message...",
  "status": "read",
  "adminNotes": "Internal notes about this contact"
}
```

#### Update Contact Status
**PATCH** `/api/contact/:id/status`

```json
{
  "status": "replied",
  "adminNotes": "Replied via email on 2024-01-15"
}
```

#### Delete Contact
**DELETE** `/api/contact/:id`

#### Get Contact Statistics
**GET** `/api/contact/stats`

Response:
```json
{
  "success": true,
  "data": {
    "total": 150,
    "new": 25,
    "read": 30,
    "replied": 45,
    "closed": 40,
    "spam": 10
  }
}
```

## Contact Status Flow

```
new → read → replied → closed
  ↓      ↓       ↓
spam   spam    spam
```

### Status Descriptions:
- **new** - Newly submitted contact (default)
- **read** - Admin has read the contact
- **replied** - Admin has replied to the contact
- **closed** - Contact has been resolved/closed
- **spam** - Marked as spam

## Usage Examples

### Frontend Integration

```javascript
// Create a contact
const createContact = async (contactData) => {
  const response = await fetch('/api/contact/create-contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(contactData)
  });
  return response.json();
};

// Get all contacts (admin)
const getContacts = async (page = 1, status = null) => {
  const params = new URLSearchParams({ page: page.toString() });
  if (status) params.append('status', status);
  
  const response = await fetch(`/api/contact?${params}`);
  return response.json();
};

// Update contact status (admin)
const updateStatus = async (id, status, notes) => {
  const response = await fetch(`/api/contact/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, adminNotes: notes })
  });
  return response.json();
};

// Search contacts (admin)
const searchContacts = async (query, page = 1) => {
  const params = new URLSearchParams({ 
    search: query, 
    page: page.toString() 
  });
  
  const response = await fetch(`/api/contact/search?${params}`);
  return response.json();
};
```

### Admin Dashboard Features

1. **Contact List View**
   - Paginated list of all contacts
   - Filter by status
   - Search functionality
   - Sort by date (newest first)

2. **Contact Detail View**
   - View full contact information
   - Update status with notes
   - Edit contact details
   - Delete contact

3. **Statistics Dashboard**
   - Total contacts count
   - Contacts by status
   - Recent activity

## Database Indexes

Optimized indexes for performance:
- `email` - For email lookups
- `status` - For status filtering
- `createdAt` - For date sorting
- `status + createdAt` - For combined filtering and sorting

## Validation Rules

- **Email**: Required, valid email format, lowercase
- **Name**: Optional, max 100 characters, trimmed
- **Subject**: Optional, max 200 characters, trimmed
- **Message**: Optional, max 2000 characters, trimmed
- **Status**: Must be one of: new, read, replied, closed, spam
- **Admin Notes**: Optional, max 1000 characters, trimmed

## Security Considerations

- Add authentication middleware to admin routes
- Validate admin permissions
- Sanitize input data
- Rate limiting for contact creation
- CSRF protection for admin operations

## Error Handling

All endpoints return consistent error responses:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Error description",
  "data": null
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error
