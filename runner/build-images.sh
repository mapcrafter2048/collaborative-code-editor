#!/bin/bash

# Build Docker images for code execution
# Supports: Python, JavaScript, TypeScript

echo "🐳 Building Docker images..."
echo ""

# Build Python runner
echo "📦 Building Python runner image..."
docker build -f python-runner-v2.dockerfile -t python-runner:latest .
if [ $? -ne 0 ]; then
    echo "❌ Failed to build Python runner"
    exit 1
fi
echo "✅ Python runner built successfully"

# Build Node.js runner (for JavaScript)
echo "📦 Building Node.js runner image..."
docker build -f node-runner-v2.dockerfile -t node-runner:latest .
if [ $? -ne 0 ]; then
    echo "❌ Failed to build Node.js runner"
    exit 1
fi
echo "✅ Node.js runner built successfully"

# Build TypeScript runner
echo "📦 Building TypeScript runner image..."
docker build -f typescript-runner-v2.dockerfile -t typescript-runner:latest .
if [ $? -ne 0 ]; then
    echo "❌ Failed to build TypeScript runner"
    exit 1
fi
echo "✅ TypeScript runner built successfully"

echo ""
echo "🎉 All Docker images built successfully!"
echo ""
echo "Available images:"
docker images | grep -E "python-runner|node-runner|typescript-runner"
echo ""
