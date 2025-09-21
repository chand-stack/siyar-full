# Newsletter Subscription Module

This module handles newsletter subscriptions using Klaviyo integration.

## Environment Variables

Add these variables to your `.env` file:

```env
# Klaviyo Newsletter Configuration
KLAVIYO_LIST_ID=VQAAPh
KLAVIYO_PRIVATE_API_KEY=pk_22d815e26ba048dcde20008844122a8166
```

## API Endpoints

### Public Endpoints

#### Subscribe to Newsletter
**POST** `/api/newsletter/subscribe`

```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "source": "website"
}
```

#### Unsubscribe from Newsletter
**POST** `/api/newsletter/unsubscribe`

```json
{
  "email": "user@example.com"
}
```

#### Get Subscription Status
**GET** `/api/newsletter/subscription/:email`

### Admin Endpoints

#### Get All Subscriptions
**GET** `/api/newsletter?page=1&limit=20&status=active`

#### Get Newsletter Statistics
**GET** `/api/newsletter/stats`

## Features

- ✅ Email validation using Mongoose
- ✅ Duplicate email handling
- ✅ Klaviyo integration
- ✅ Subscription status tracking
- ✅ Metadata collection (IP, User-Agent, Source)
- ✅ Reactivation of unsubscribed users
- ✅ Comprehensive error handling
- ✅ Database persistence
- ✅ Statistics and analytics

## Database Schema

```typescript
{
  email: string (unique, required)
  firstName?: string
  lastName?: string
  status: "active" | "unsubscribed" | "pending"
  klaviyoProfileId?: string
  subscribedAt: Date
  unsubscribedAt?: Date
  metadata?: {
    source?: string
    ipAddress?: string
    userAgent?: string
  }
}
```

## Usage Examples

### Frontend Integration

```javascript
// Subscribe to newsletter
const subscribe = async (email, firstName, lastName) => {
  const response = await fetch('/api/newsletter/subscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      firstName,
      lastName,
      source: 'website'
    })
  });
  
  const result = await response.json();
  return result;
};

// Unsubscribe from newsletter
const unsubscribe = async (email) => {
  const response = await fetch('/api/newsletter/unsubscribe', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email })
  });
  
  const result = await response.json();
  return result;
};
```

### Error Handling

The API returns appropriate HTTP status codes and error messages:

- `201` - Successfully subscribed
- `200` - Successfully unsubscribed or retrieved data
- `400` - Bad request (invalid email, already subscribed, etc.)
- `404` - Subscription not found
- `500` - Server error

## Klaviyo Integration

The module integrates with Klaviyo's List API v2 to:
- Add subscribers to the specified list
- Handle duplicate subscriptions gracefully
- Track subscription metadata
- Maintain sync between local database and Klaviyo

## Security Features

- Email validation and sanitization
- Rate limiting ready (can be added with middleware)
- IP address tracking for analytics
- User-Agent tracking for source identification
- Private API key handling (server-side only)
