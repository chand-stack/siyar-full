# Dual-Language Article Support Guide

This guide explains how to use the new dual-language functionality for articles, allowing users to post both English and Arabic versions seamlessly.

## Overview

The article model now supports dual-language content through a new `dualLanguage` field that can store both English (`en`) and Arabic (`ar`) versions of an article. This maintains full backward compatibility with existing articles.

## Data Structure

### New Fields Added

```typescript
// Dual-language content structure
dualLanguage?: {
  en?: {
    title?: string;
    subtitle?: string;
    excerpt?: string;
    content?: {
      html: string;
      plainText?: string;
      wordCount: number;
    };
    featuredImage?: {
      url: string;
      alt: string;
      caption?: string;
    };
    meta?: {
      description: string;
      keywords: string[];
      ogImage?: string;
    };
    readTime?: string;
    status?: "draft" | "published" | "archived";
  };
  ar?: {
    // Same structure as English
  };
}

// Dual-language author, title, subtitle fields
dualLanguageAuthor?: {
  en?: string;
  ar?: string;
};

dualLanguageTitle?: {
  en?: string;
  ar?: string;
};

dualLanguageSubtitle?: {
  en?: string;
  ar?: string;
};
```

## API Endpoints

### 1. Create Dual-Language Article
**POST** `/api/articles/dual-language`

Creates a new article with both English and Arabic content.

```json
{
  "slug": "my-article",
  "language": "en",
  "author": "Author Name",
  "categories": ["categoryId1", "categoryId2"],
  "dualLanguage": {
    "en": {
      "title": "English Title",
      "subtitle": "English Subtitle",
      "excerpt": "English excerpt...",
      "content": {
        "html": "<p>English HTML content...</p>",
        "plainText": "English plain text content..."
      },
      "featuredImage": {
        "url": "https://example.com/image.jpg",
        "alt": "English alt text"
      },
      "meta": {
        "description": "English meta description",
        "keywords": ["english", "keywords"]
      },
      "status": "published"
    },
    "ar": {
      "title": "العنوان العربي",
      "subtitle": "العنوان الفرعي العربي",
      "excerpt": "المقتطف العربي...",
      "content": {
        "html": "<p>المحتوى العربي...</p>",
        "plainText": "المحتوى العربي النصي..."
      },
      "featuredImage": {
        "url": "https://example.com/image.jpg",
        "alt": "النص البديل العربي"
      },
      "meta": {
        "description": "الوصف العربي",
        "keywords": ["عربي", "كلمات"]
      },
      "status": "published"
    }
  }
}
```

### 2. Update Dual-Language Article
**PATCH** `/api/articles/:id/dual-language`

Updates an existing dual-language article.

```json
{
  "dualLanguage": {
    "en": {
      "title": "Updated English Title",
      "status": "published"
    },
    "ar": {
      "title": "العنوان العربي المحدث",
      "status": "published"
    }
  }
}
```

### 3. Add Arabic Version to Existing Article
**POST** `/api/articles/:id/arabic-version`

Adds Arabic content to an existing English-only article.

```json
{
  "title": "العنوان العربي",
  "subtitle": "العنوان الفرعي العربي",
  "excerpt": "المقتطف العربي...",
  "content": {
    "html": "<p>المحتوى العربي...</p>",
    "plainText": "المحتوى العربي النصي..."
  },
  "featuredImage": {
    "url": "https://example.com/image.jpg",
    "alt": "النص البديل العربي"
  },
  "meta": {
    "description": "الوصف العربي",
    "keywords": ["عربي", "كلمات"]
  },
  "status": "published"
}
```

### 4. Add Arabic Author, Title, Subtitle to Existing Article
**POST** `/api/articles/:id/arabic-fields`

Adds Arabic author, title, and subtitle to an existing article.

```json
{
  "author": "المؤلف العربي",
  "title": "العنوان العربي",
  "subtitle": "العنوان الفرعي العربي"
}
```

### 5. Update Dual-Language Author, Title, Subtitle
**PATCH** `/api/articles/:id/dual-language-fields`

Updates author, title, and subtitle in both languages.

```json
{
  "dualLanguageAuthor": {
    "en": "English Author",
    "ar": "المؤلف العربي"
  },
  "dualLanguageTitle": {
    "en": "English Title",
    "ar": "العنوان العربي"
  },
  "dualLanguageSubtitle": {
    "en": "English Subtitle",
    "ar": "العنوان الفرعي العربي"
  }
}
```

### 6. Get Article (Enhanced)
**GET** `/api/articles/:slug?language=en|ar`

The existing get article endpoint now supports dual-language articles. It will:
1. First try to find by slug and language (existing behavior)
2. If not found, try to find by slug and check dual-language content

## Migration Strategy

### For Existing Articles

1. **No Changes Required**: Existing articles continue to work exactly as before
2. **Gradual Migration**: You can add Arabic versions to existing articles using the `addArabicVersion` endpoint
3. **Backward Compatibility**: All existing API endpoints continue to work

### Example Migration Flow

1. **Existing Article**: An article exists with only English content
2. **Add Arabic Version**: Use `POST /api/articles/:id/arabic-version` to add Arabic content
3. **Result**: The article now has both English and Arabic versions accessible

## Usage Scenarios

### Scenario 1: New Dual-Language Article
```javascript
// Create article with both languages from the start
const response = await fetch('/api/articles/dual-language', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    slug: 'new-article',
    language: 'en',
    author: 'Author Name',
    dualLanguage: {
      en: { /* English content */ },
      ar: { /* Arabic content */ }
    }
  })
});
```

### Scenario 2: Add Arabic to Existing Article
```javascript
// Add Arabic version to existing English article
const response = await fetch('/api/articles/123/arabic-version', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'العنوان العربي',
    content: { html: '<p>المحتوى العربي...</p>' },
    status: 'published'
  })
});
```

### Scenario 2b: Add Arabic Author, Title, Subtitle
```javascript
// Add Arabic author, title, subtitle to existing article
const response = await fetch('/api/articles/123/arabic-fields', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    author: 'المؤلف العربي',
    title: 'العنوان العربي',
    subtitle: 'العنوان الفرعي العربي'
  })
});
```

### Scenario 3: Update Both Languages
```javascript
// Update both English and Arabic content
const response = await fetch('/api/articles/123/dual-language', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dualLanguage: {
      en: { title: 'Updated English Title' },
      ar: { title: 'العنوان العربي المحدث' }
    }
  })
});
```

### Scenario 3b: Update Dual-Language Author, Title, Subtitle
```javascript
// Update author, title, subtitle in both languages
const response = await fetch('/api/articles/123/dual-language-fields', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    dualLanguageAuthor: {
      en: 'Updated English Author',
      ar: 'المؤلف العربي المحدث'
    },
    dualLanguageTitle: {
      en: 'Updated English Title',
      ar: 'العنوان العربي المحدث'
    }
  })
});
```

## Database Indexes

New indexes have been added for optimal performance:
- `dualLanguage.en.status`
- `dualLanguage.ar.status`
- `slug + dualLanguage.en.status`
- `slug + dualLanguage.ar.status`
- `dualLanguageAuthor.en`
- `dualLanguageAuthor.ar`
- `dualLanguageTitle.en`
- `dualLanguageTitle.ar`

## Validation

The system validates:
- Content length limits (10MB for HTML, 5MB for plain text)
- Required fields for each language
- Proper status values
- Word count calculation for both languages

## Error Handling

Common error messages:
- "At least one language (English or Arabic) must be provided in dualLanguage content."
- "English/Arabic HTML content is too long. Maximum allowed length is 10MB."
- "English/Arabic plain text content is too long. Maximum allowed length is 5MB."
- "Article not found" (when adding Arabic version to non-existent article)

## Best Practices

1. **Consistent Slugs**: Use the same slug for both language versions
2. **Status Management**: Manage status independently for each language
3. **Content Validation**: Ensure both versions have appropriate content
4. **SEO Optimization**: Provide proper meta descriptions and keywords for both languages
5. **Image Alt Text**: Include appropriate alt text in both languages

## Backward Compatibility

- All existing articles continue to work without modification
- Existing API endpoints remain unchanged
- No database migration required
- Existing frontend code continues to work
