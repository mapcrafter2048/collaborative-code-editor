# syntax=docker/dockerfile:1
# Java Runner Docker Image - Version 2
# Optimized for security, performance, and resource management

FROM openjdk:21-jdk-slim

# Install essential tools
RUN apt-get update && apt-get install -y --no-install-recommends \
    coreutils \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user for security
RUN groupadd -r coderunner && useradd --no-log-init -r -g coderunner coderunner

# Set up secure working directory
WORKDIR /app

# Change ownership of the app directory to the non-root user
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD java --version || exit 1

# Default entry point
CMD ["/bin/bash"]
