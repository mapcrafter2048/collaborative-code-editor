# Optimized Go Runner for Collaborative Code Editor
FROM golang:1.21-alpine

# Install basic tools
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Make app directory writable by all users
RUN chmod 777 /app

# Default command - will be overridden by DockerExecutionService
CMD ["echo", "Go runner ready"]
