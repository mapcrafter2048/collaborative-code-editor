# syntax=docker/dockerfile:1
# C Runner Docker Image - Version 2
# Optimized for security, performance, and resource management

FROM alpine:3.18

# Install C compiler and essential tools
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libc-dev \
    coreutils

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
    CMD gcc --version || exit 1

# Default entry point
CMD ["/bin/sh"]
