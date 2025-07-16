# Optimized Go Runner for Collaborative Code Editor
FROM golang:1.21-alpine

# Install basic tools
RUN apk add --no-cache git

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN adduser -D -s /bin/sh coderunner

# Set proper permissions
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Default command - will be overridden by DockerExecutionService
CMD ["echo", "Go runner ready"]
