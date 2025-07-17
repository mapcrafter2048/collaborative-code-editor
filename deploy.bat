@echo off
REM Deployment script for Railway/DigitalOcean
echo 🚀 Starting deployment process...

REM Build frontend
echo 📦 Building frontend...
npm run build

REM Build Docker images
echo 🐳 Building Docker images...
docker build -t collaborative-code-editor-frontend .
docker build -t collaborative-code-editor-backend ./server

echo ✅ Build completed!
echo 🔧 Next steps:
echo 1. Push your code to GitHub
echo 2. Connect your repository to your deployment platform
echo 3. Set environment variables in your deployment platform
echo 4. Deploy!
