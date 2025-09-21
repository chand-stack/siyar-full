# Translation API Module

This module provides Google Translate integration for your frontend applications without changing any existing backend settings.

## Features

- **Single Text Translation** - Translate individual text strings
- **Batch Translation** - Translate multiple texts at once
- **Language Detection** - Automatic source language detection
- **Supported Languages** - Get list of all supported languages
- **Health Check** - Service status endpoint

## API Endpoints

### 1. Health Check
**GET** `/api/translate/health`

Check if translation service is running.

**Response:**
```json
{
  "success": true,
  "status": "OK",
  "message": "Translation service is running"
}
```

### 2. Single Translation
**POST** `/api/translate/`

Translate a single text string.

**Request Body:**
```json
{
  "text": "Hello world",
  "to": "es",
  "from": "auto"  // Optional, defaults to 'auto'
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "text": "Hola mundo",
    "from": "en",
    "to": "es",
    "original": "Hello world"
  }
}
```

### 3. Batch Translation
**POST** `/api/translate/batch`

Translate multiple text strings at once.

**Request Body:**
```json
{
  "texts": ["Hello", "World", "How are you?"],
  "to": "fr",
  "from": "auto"  // Optional, defaults to 'auto'
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "translations": ["Bonjour", "Monde", "Comment allez-vous?"],
    "from": "auto",
    "to": "fr",
    "originals": ["Hello", "World", "How are you?"],
    "count": 3
  }
}
```

### 4. Get Supported Languages
**GET** `/api/translate/languages`

Get list of all supported languages.

**Response:**
```json
{
  "success": true,
  "data": {
    "languages": {
      "en": "English",
      "es": "Spanish",
      "fr": "French",
      "de": "German",
      // ... more languages
    },
    "count": 104
  }
}
```

## Frontend Usage Examples

### JavaScript/Fetch

#### Single Translation
```javascript
const translateText = async (text, targetLanguage) => {
  try {
    const response = await fetch('/api/translate/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        to: targetLanguage,
        from: 'auto'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.text;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

// Usage
translateText('Hello world', 'es')
  .then(translated => console.log(translated)); // "Hola mundo"
```

#### Batch Translation
```javascript
const translateBatch = async (texts, targetLanguage) => {
  try {
    const response = await fetch('/api/translate/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts: texts,
        to: targetLanguage,
        from: 'auto'
      })
    });
    
    const data = await response.json();
    
    if (data.success) {
      return data.data.translations;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Batch translation error:', error);
    throw error;
  }
};

// Usage
translateBatch(['Hello', 'World', 'Goodbye'], 'fr')
  .then(translations => console.log(translations)); 
  // ["Bonjour", "Monde", "Au revoir"]
```

#### Get Languages
```javascript
const getSupportedLanguages = async () => {
  try {
    const response = await fetch('/api/translate/languages');
    const data = await response.json();
    
    if (data.success) {
      return data.data.languages;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error('Error fetching languages:', error);
    throw error;
  }
};

// Usage
getSupportedLanguages()
  .then(languages => {
    Object.entries(languages).forEach(([code, name]) => {
      console.log(`${code}: ${name}`);
    });
  });
```

### React Component Example

```jsx
import React, { useState } from 'react';

const TranslatorComponent = () => {
  const [text, setText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/translate/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: text,
          to: targetLanguage,
          from: 'auto'
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setTranslatedText(data.data.text);
      } else {
        alert('Translation failed: ' + data.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Text Translator</h2>
      
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter text to translate..."
        rows="4"
        cols="50"
      />
      
      <br />
      
      <select 
        value={targetLanguage} 
        onChange={(e) => setTargetLanguage(e.target.value)}
      >
        <option value="es">Spanish</option>
        <option value="fr">French</option>
        <option value="de">German</option>
        <option value="it">Italian</option>
        <option value="pt">Portuguese</option>
        <option value="ru">Russian</option>
        <option value="ja">Japanese</option>
        <option value="ko">Korean</option>
        <option value="zh">Chinese</option>
        <option value="ar">Arabic</option>
      </select>
      
      <br />
      
      <button onClick={handleTranslate} disabled={loading || !text.trim()}>
        {loading ? 'Translating...' : 'Translate'}
      </button>
      
      {translatedText && (
        <div>
          <h3>Translation:</h3>
          <p>{translatedText}</p>
        </div>
      )}
    </div>
  );
};

export default TranslatorComponent;
```

## Common Language Codes

- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `ja` - Japanese
- `ko` - Korean
- `zh` - Chinese
- `ar` - Arabic
- `hi` - Hindi
- `tr` - Turkish
- `pl` - Polish
- `nl` - Dutch

## Error Handling

All endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Notes

- Uses Google Translate API via `google-translate-api-x` package
- Automatic language detection when `from` is set to `'auto'`
- No API keys required for basic usage
- Rate limiting may apply for heavy usage
- Works with all existing backend functionality
- No changes to existing routes or settings
