#!/bin/bash

# Collaborative Code Editor Setup Script
# Supports: Python, JavaScript, TypeScript

echo "🚀 Setting up Collaborative Code Editor..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Docker is required for code execution."
    echo "   Please install Docker from: https://www.docker.com/get-started"
    exit 1
fi

echo "✅ Docker version: $(docker --version)"

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
npm install

# Install server dependencies
echo ""
echo "📦 Installing server dependencies..."
cd server
npm install
cd ..

# Build Docker images
echo ""
echo "🐳 Building Docker images for Python, JavaScript, and TypeScript..."
cd runner
chmod +x build-images.sh
./build-images.sh
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "  1. Start the server:  cd server && npm run dev"
echo "  2. Start the frontend: npm run dev"
echo "  3. Open http://localhost:3000 in your browser"
echo ""
