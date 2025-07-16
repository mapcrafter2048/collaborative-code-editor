# Optimized Python Runner for Collaborative Code Editor
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set working directory
WORKDIR /app

# Make app directory writable by all users
RUN chmod 777 /app

# Default command - will be overridden by DockerExecutionService
CMD ["echo", "Python runner ready"]
