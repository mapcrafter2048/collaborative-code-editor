# syntax=docker/dockerfile:1
# Ruby Runner Docker Image - Version 2
# Optimized for security, performance, and resource management

FROM ruby:3.2-alpine

# Install essential tools and build dependencies
RUN apk add --no-cache \
    build-base \
    coreutils \
    git

# Create a non-root user for security
RUN adduser -D -s /bin/sh coderunner

# Set up secure working directory
WORKDIR /app

# Install common gems for basic functionality
RUN gem install bundler --no-document

# Change ownership of the app directory to the non-root user
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD ruby --version || exit 1

# Default entry point
CMD ["/bin/sh"]
