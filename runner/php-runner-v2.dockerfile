# syntax=docker/dockerfile:1
# PHP Runner Docker Image - Version 2
# Optimized for security, performance, and resource management

FROM php:8.2-cli-alpine

# Install essential tools and PHP extensions
RUN apk add --no-cache \
    coreutils \
    && docker-php-ext-install opcache

# Create a non-root user for security
RUN adduser -D -s /bin/sh coderunner

# Set up secure working directory
WORKDIR /app

# Change ownership of the app directory to the non-root user
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD php --version || exit 1

# Default entry point
CMD ["/bin/sh"]
