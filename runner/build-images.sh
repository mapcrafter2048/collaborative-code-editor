#!/bin/bash

# Build script for collaborative code editor Docker images
echo "🐳 Building Docker images for collaborative code editor..."

# Change to the project root directory
cd "$(dirname "$0")/.."

# Build C++ runner
echo "📦 Building C++ runner..."
docker build -f runner/cpp-runner-v2.dockerfile -t cpp-runner:latest .

# Build Python runner
echo "📦 Building Python runner..."
docker build -f runner/python-runner-v2.dockerfile -t python-runner:latest .

# Build Go runner
echo "📦 Building Go runner..."
docker build -f runner/go-runner-v2.dockerfile -t go-runner:latest .

# Build Node.js runner
echo "📦 Building Node.js runner..."
docker build -f runner/node-runner-v2.dockerfile -t node-runner:latest .

echo "✅ All Docker images built successfully!"
echo ""
echo "🔍 Built images:"
docker images | grep -E "(cpp-runner|python-runner|go-runner|node-runner)"

echo ""
echo "🚀 You can now start the collaborative code editor server!"
