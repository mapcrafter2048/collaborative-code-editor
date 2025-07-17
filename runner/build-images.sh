#!/bin/bash

# Build script for collaborative code editor Docker images
echo "🐳 Building Docker images for collaborative code editor..."

# Change to the project root directory
cd "$(dirname "$0")/.."

# Build C runner
echo "📦 Building C runner..."
docker build -f runner/c-runner-v2.dockerfile -t c-runner:latest .

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

# Build TypeScript runner
echo "📦 Building TypeScript runner..."
docker build -f runner/typescript-runner-v2.dockerfile -t typescript-runner:latest .

# Build Rust runner
echo "📦 Building Rust runner..."
docker build -f runner/rust-runner-v2.dockerfile -t rust-runner:latest .

# Build PHP runner
echo "📦 Building PHP runner..."
docker build -f runner/php-runner-v2.dockerfile -t php-runner:latest .

# Build Ruby runner
echo "📦 Building Ruby runner..."
docker build -f runner/ruby-runner-v2.dockerfile -t ruby-runner:latest .

# Build Java runner
echo "📦 Building Java runner..."
docker build -f runner/java-runner-v2.dockerfile -t java-runner:latest .

echo "✅ All Docker images built successfully!"
echo ""
echo "🔍 Built images:"
docker images | grep -E "(c-runner|cpp-runner|python-runner|go-runner|node-runner|typescript-runner|rust-runner|php-runner|ruby-runner|java-runner)"

echo ""
echo "🚀 You can now start the collaborative code editor server!"
