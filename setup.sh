#!/bin/bash

# Comprehensive setup script for Collaborative Code Editor
echo "🚀 Setting up Collaborative Code Editor..."

# Check if Docker is installed and running
echo "🔍 Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "   Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "✅ Docker is available and running"

# Clean up old images (optional)
echo "🧹 Cleaning up old Docker images..."
docker rmi c-runner:latest cpp-runner:latest python-runner:latest go-runner:latest node-runner:latest typescript-runner:latest rust-runner:latest php-runner:latest ruby-runner:latest 2>/dev/null || true
docker image prune -f 2>/dev/null || true

# Build Docker images
echo "📦 Building Docker images..."

echo "  🔧 Building C runner..."
docker build -f runner/c-runner-v2.dockerfile -t c-runner:latest . || {
    echo "❌ Failed to build C runner"
    exit 1
}

echo "  🔧 Building C++ runner..."
docker build -f runner/cpp-runner-v2.dockerfile -t cpp-runner:latest . || {
    echo "❌ Failed to build C++ runner"
    exit 1
}

echo "  🐍 Building Python runner..."
docker build -f runner/python-runner-v2.dockerfile -t python-runner:latest . || {
    echo "❌ Failed to build Python runner"
    exit 1
}

echo "  🐹 Building Go runner..."
docker build -f runner/go-runner-v2.dockerfile -t go-runner:latest . || {
    echo "❌ Failed to build Go runner"
    exit 1
}

echo "  📦 Building Node.js runner..."
docker build -f runner/node-runner-v2.dockerfile -t node-runner:latest . || {
    echo "❌ Failed to build Node.js runner"
    exit 1
}

echo "  📘 Building TypeScript runner..."
docker build -f runner/typescript-runner-v2.dockerfile -t typescript-runner:latest . || {
    echo "❌ Failed to build TypeScript runner"
    exit 1
}

echo "  🦀 Building Rust runner..."
docker build -f runner/rust-runner-v2.dockerfile -t rust-runner:latest . || {
    echo "❌ Failed to build Rust runner"
    exit 1
}

echo "  🐘 Building PHP runner..."
docker build -f runner/php-runner-v2.dockerfile -t php-runner:latest . || {
    echo "❌ Failed to build PHP runner"
    exit 1
}

echo "  💎 Building Ruby runner..."
docker build -f runner/ruby-runner-v2.dockerfile -t ruby-runner:latest . || {
    echo "❌ Failed to build Ruby runner"
    exit 1
}

echo "✅ All Docker images built successfully!"

# Test Docker images
echo "🧪 Testing Docker images..."

echo "  Testing C runner..."
echo 'int main(){return 0;}' > /tmp/test.c
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app c-runner:latest sh -c 'cp /host/test.c /app/code.c && gcc code.c -o code.out && ./code.out' && echo "  ✅ C runner works"

echo "  Testing C++ runner..."
echo 'int main(){return 0;}' > /tmp/test.cpp
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app cpp-runner:latest sh -c 'cp /host/test.cpp /app/code.cpp && g++ code.cpp -o code.out && ./code.out' && echo "  ✅ C++ runner works"

echo "  Testing Python runner..."
echo 'print("Hello, World!")' > /tmp/test.py
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app python-runner:latest sh -c 'cp /host/test.py /app/code.py && python code.py' && echo "  ✅ Python runner works"

echo "  Testing Go runner..."
echo 'package main; import "fmt"; func main(){fmt.Println("Hello, World!")}' > /tmp/test.go
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app go-runner:latest sh -c 'cp /host/test.go /app/code.go && go run code.go' && echo "  ✅ Go runner works"

echo "  Testing Node.js runner..."
echo 'console.log("Hello, World!")' > /tmp/test.js
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app node-runner:latest sh -c 'cp /host/test.js /app/code.js && node code.js' && echo "  ✅ Node.js runner works"

echo "  Testing TypeScript runner..."
echo 'console.log("Hello, TypeScript!");' > /tmp/test.ts
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app typescript-runner:latest sh -c 'cp /host/test.ts /app/code.ts && ts-node code.ts' && echo "  ✅ TypeScript runner works"

echo "  Testing Rust runner..."
echo 'fn main(){println!("Hello, World!");}' > /tmp/test.rs
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app rust-runner:latest sh -c 'cp /host/test.rs /app/code.rs && rustc code.rs -o code.out && ./code.out' && echo "  ✅ Rust runner works"

echo "  Testing PHP runner..."
echo '<?php echo "Hello, World!"; ?>' > /tmp/test.php
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app php-runner:latest sh -c 'cp /host/test.php /app/code.php && php code.php' && echo "  ✅ PHP runner works"

echo "  Testing Ruby runner..."
echo 'puts "Hello, World!"' > /tmp/test.rb
docker run --rm -v /tmp:/host:ro --tmpfs /app:size=100m --workdir /app ruby-runner:latest sh -c 'cp /host/test.rb /app/code.rb && ruby code.rb' && echo "  ✅ Ruby runner works"

# Clean up test files
rm -f /tmp/test.c /tmp/test.cpp /tmp/test.py /tmp/test.go /tmp/test.js /tmp/test.ts /tmp/test.rs /tmp/test.php /tmp/test.rb

echo ""
echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Built images:"
docker images | grep -E "(c-runner|cpp-runner|python-runner|go-runner|node-runner|typescript-runner|rust-runner|php-runner|ruby-runner)"
echo ""
echo "🚀 Next steps:"
echo "1. Install dependencies:"
echo "   Frontend: npm install"
echo "   Backend:  cd server && npm install"
echo ""
echo "2. Start the application:"
echo "   Backend:  cd server && npm start"
echo "   Frontend: npm run dev"
echo ""
echo "3. Open your browser to: http://localhost:3000"
