#!/bin/bash

# Docker cleanup script for Collaborative Code Editor
echo "🧹 Cleaning up Docker images and containers..."

# Remove old/dangling images
echo "🗑️ Removing dangling images..."
docker image prune -f

# Remove unused containers
echo "🗑️ Removing unused containers..."
docker container prune -f

# Remove unused networks
echo "🗑️ Removing unused networks..."
docker network prune -f

# Remove unused volumes
echo "🗑️ Removing unused volumes..."
docker volume prune -f

# Remove old versions of our runner images (if any)
echo "🗑️ Removing old runner images..."
docker images | grep -E "(runner|code-exec)" | grep -v "latest" | awk '{print $3}' | xargs docker rmi 2>/dev/null || true

# Show current images
echo ""
echo "📋 Current runner images:"
docker images | grep -E "(cpp-runner|c-runner|python-runner|go-runner|node-runner|typescript-runner|rust-runner|php-runner|ruby-runner)" || echo "No runner images found"

echo ""
echo "💾 Docker disk usage:"
docker system df

echo ""
echo "✅ Cleanup completed!"
