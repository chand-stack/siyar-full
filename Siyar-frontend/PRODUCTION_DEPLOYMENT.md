# Production Deployment Guide

## 🚀 Step-by-Step Deployment

### 1. Deploy Translation Server

#### Option A: Railway (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login to Railway
railway login

# Create new project
railway init

# Deploy the translation server
railway up

# Your server will be available at: https://your-app-name.railway.app
```

#### Option B: Heroku
```bash
# Install Heroku CLI and login
heroku login

# Create new app
heroku create your-translation-server-name

# Deploy
git add .
git commit -m "Deploy translation server"
git push heroku main

# Your server will be available at: https://your-translation-server-name.herokuapp.com
```

### 2. Configure Frontend

#### Create Environment Variables
Create `.env.production`:
```bash
VITE_TRANSLATION_API_URL=https://your-deployed-server.railway.app/api
```

Create `.env.development`:
```bash
VITE_TRANSLATION_API_URL=http://localhost:3001/api
```

#### Update CORS in Translation Server
Replace the CORS origins in `translation-server.js` with your actual frontend URLs:
```javascript
origin: process.env.NODE_ENV === 'production' 
  ? ['https://your-frontend.vercel.app', 'https://your-custom-domain.com']
  : 'http://localhost:5173'
```

### 3. Deploy Frontend

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

### 4. Test Production Setup

1. Visit your deployed frontend
2. Open browser console
3. Switch languages
4. Look for successful translation logs:
   ```
   Translating "Islamic History" to ar via backend API
   Translation result: "Islamic History" -> "التاريخ الإسلامي"
   ```

## 🔧 Configuration Checklist

- [ ] Translation server deployed and accessible
- [ ] Environment variables configured
- [ ] CORS updated with production domains
- [ ] Frontend deployed
- [ ] Translation functionality tested in production

## 🚨 Important Notes

### Rate Limiting
- Google Translate may rate limit your server
- Consider implementing request throttling
- Monitor usage to avoid hitting limits

### Caching
- Frontend caches translations in memory
- Consider adding Redis cache to the server for persistence
- This reduces API calls and improves performance

### Error Handling
- Server automatically falls back to original text if translation fails
- Monitor server logs for translation errors
- Set up error alerts for production

### Security
- Consider adding API key authentication
- Implement rate limiting on your server
- Monitor for abuse

## 🛠️ Optional Enhancements

### 1. Add Redis Caching
```bash
npm install redis
```

### 2. Add Rate Limiting
```bash
npm install express-rate-limit
```

### 3. Add Authentication
```bash
npm install jsonwebtoken
```

### 4. Add Monitoring
```bash
npm install winston
```

## 📊 Monitoring

Monitor these metrics in production:
- Translation success rate
- Response times
- Error rates
- Cache hit rates
- Google API usage

## 🆘 Troubleshooting

### Translation Not Working in Production
1. Check server health endpoint: `https://your-server.com/health`
2. Verify CORS configuration
3. Check browser console for network errors
4. Verify environment variables are set

### 403 Errors from Google
- Google is rate limiting your server
- Try different `client` parameter values
- Implement request delays
- Consider using official Google Cloud Translation API

### Server Timeout
- Increase server timeout limits
- Implement request queuing
- Add retry logic with exponential backoff
