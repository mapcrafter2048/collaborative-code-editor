# Optimized C++ Runner for Collaborative Code Editor
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    g++ \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set working directory
WORKDIR /app

# Make app directory writable by all users
RUN chmod 777 /app

# Default command - will be overridden by DockerExecutionService
CMD ["echo", "C++ runner ready"]
