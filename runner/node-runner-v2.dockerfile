# Optimized Node.js Runner for Collaborative Code Editor
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Make app directory writable by all users
RUN chmod 777 /app

# Default command - will be overridden by DockerExecutionService
CMD ["echo", "Node.js runner ready"]
