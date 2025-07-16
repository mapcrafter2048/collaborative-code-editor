# Rust Runner for Collaborative Code Editor
FROM rust:1.70-slim

# Install necessary tools
RUN apt-get update && apt-get install -y \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN useradd -m -s /bin/bash coderunner

# Set proper permissions
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Default command - will be overridden by DockerExecutionService
CMD ["echo", "Rust runner ready"]
