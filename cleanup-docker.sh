#!/bin/bash

# Docker cleanup script for Collaborative Code Editor (Linux/macOS)
echo "🧹 Cleaning up Docker images and containers..."

# Stop any running containers using our images
echo "🔄 Stopping any running containers..."
docker ps -q --filter "ancestor=cpp-runner" --filter "ancestor=python-runner" --filter "ancestor=go-runner" --filter "ancestor=node-runner" --filter "ancestor=rust-runner" --filter "ancestor=php-runner" --filter "ancestor=ruby-runner" --filter "ancestor=c-runner" --filter "ancestor=typescript-runner" | xargs -r docker stop

# Remove old/unused containers
echo "🗑️ Removing unused containers..."
docker container prune -f

# Remove old versions of our images
echo "🗑️ Removing old runner images..."
docker rmi cpp-runner:latest python-runner:latest go-runner:latest node-runner:latest rust-runner:latest php-runner:latest ruby-runner:latest c-runner:latest typescript-runner:latest 2>/dev/null || true

# Remove dangling images
echo "🗑️ Removing dangling images..."
docker image prune -f

# Remove unused volumes
echo "🗑️ Removing unused volumes..."
docker volume prune -f

# Remove unused networks
echo "🗑️ Removing unused networks..."
docker network prune -f

# Show current space usage
echo "📊 Current Docker space usage:"
docker system df

echo ""
echo "✅ Cleanup completed!"
echo "💡 To rebuild images, run: ./setup.sh"
echo "💡 For aggressive cleanup of ALL unused Docker data, run: docker system prune -a -f"
