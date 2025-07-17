# 🚀 Deployment Guide

This guide will help you deploy your Collaborative Code Editor using your GitHub Student Developer Pack benefits.

## 📋 Prerequisites

1. ✅ GitHub Student Developer Pack activated
2. ✅ Code pushed to GitHub repository
3. ✅ Docker installed (for local testing)

## 🎯 Recommended Deployment Strategy

### Option 1: Vercel (Frontend) + Railway (Backend) - **RECOMMENDED**

#### Frontend Deployment (Vercel)
1. **Sign up for Vercel** using your GitHub account
2. **Connect your repository**
3. **Set environment variables:**
   ```
   NEXT_PUBLIC_SERVER_URL=https://your-backend-url.railway.app
   ```
4. **Deploy** - Vercel will automatically build and deploy your Next.js app

#### Backend Deployment (Railway)
1. **Sign up for Railway** using your GitHub Student Pack
2. **Create a new project** from GitHub repository
3. **Select the server folder** as root directory
4. **Set environment variables:**
   ```
   NODE_ENV=production
   PORT=8080
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```
5. **Deploy** - Railway will automatically build and deploy your Node.js server

### Option 2: DigitalOcean App Platform (Full-Stack)

1. **Sign up for DigitalOcean** using your GitHub Student Pack ($200 credit)
2. **Create an App** from GitHub repository
3. **Configure services:**
   - **Frontend**: Next.js app (root directory)
   - **Backend**: Node.js app (server directory)
4. **Set environment variables** as shown above
5. **Deploy** with Docker support

### Option 3: Azure Container Instances

1. **Sign up for Azure** using your GitHub Student Pack ($100 credit)
2. **Create Azure Container Registry**
3. **Push Docker images** to registry
4. **Deploy** using Azure Container Instances

## 🔧 Environment Variables Setup

### Frontend (.env.local)
```bash
NEXT_PUBLIC_SERVER_URL=https://your-backend-url.com
```

### Backend (.env)
```bash
NODE_ENV=production
PORT=8080
CLIENT_URL=https://your-frontend-url.com
```

## 🐳 Docker Deployment

### Build and run locally:
```bash
# Build images
docker build -t collaborative-code-editor-frontend .
docker build -t collaborative-code-editor-backend ./server

# Run with docker-compose
docker-compose up -d
```

### Push to container registry:
```bash
# Tag images
docker tag collaborative-code-editor-frontend your-registry/frontend:latest
docker tag collaborative-code-editor-backend your-registry/backend:latest

# Push images
docker push your-registry/frontend:latest
docker push your-registry/backend:latest
```

## 📦 Platform-Specific Instructions

### 🔷 Railway Deployment

1. **Create railway.json** in server directory:
```json
{
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/health"
  }
}
```

2. **Add health check endpoint** to your server:
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});
```

### 🔷 DigitalOcean App Platform

1. **Create .do/app.yaml**:
```yaml
name: collaborative-code-editor
services:
- name: frontend
  source_dir: /
  dockerfile_path: Dockerfile
  instance_count: 1
  instance_size_slug: basic-xxs
  env_variables:
  - key: NEXT_PUBLIC_SERVER_URL
    value: ${backend.PUBLIC_URL}
- name: backend
  source_dir: /server
  dockerfile_path: Dockerfile
  instance_count: 1
  instance_size_slug: basic-xxs
  env_variables:
  - key: CLIENT_URL
    value: ${frontend.PUBLIC_URL}
```

### 🔷 Azure Container Instances

1. **Create Azure Resource Group**
2. **Create Container Registry**
3. **Push images to registry**
4. **Deploy containers**

## 🔒 Security Considerations

1. **Environment Variables**: Never commit sensitive data
2. **CORS Configuration**: Set proper origins in production
3. **Docker Security**: Use non-root users in containers
4. **Rate Limiting**: Implement API rate limiting
5. **SSL/TLS**: Enable HTTPS in production

## 🛠️ Troubleshooting

### Common Issues:

1. **Build Errors**: Check Node.js version compatibility
2. **Connection Issues**: Verify environment variables
3. **Docker Errors**: Check Docker daemon is running
4. **WebSocket Issues**: Ensure WebSocket support is enabled

### Debug Commands:
```bash
# Check logs
docker logs container-name

# Test connectivity
curl -v http://your-backend-url/health

# Check environment variables
echo $NEXT_PUBLIC_SERVER_URL
```

## 🎉 Post-Deployment Checklist

- [ ] Frontend accessible at deployed URL
- [ ] Backend responding to API calls
- [ ] WebSocket connections working
- [ ] Code execution working (if Docker supported)
- [ ] Real-time collaboration functional
- [ ] All environment variables set correctly
- [ ] HTTPS enabled
- [ ] Custom domain configured (optional)

## 🆘 Getting Help

If you encounter issues:
1. Check the platform-specific documentation
2. Review the logs for error messages
3. Verify all environment variables are set
4. Test locally with Docker first
5. Check GitHub Student Developer Pack benefits

## 🎯 Next Steps

1. **Custom Domain**: Set up a custom domain name
2. **Monitoring**: Set up application monitoring
3. **Analytics**: Add usage analytics
4. **CDN**: Configure CDN for better performance
5. **Backup**: Set up automated backups

Good luck with your deployment! 🚀
