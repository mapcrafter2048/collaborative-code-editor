# syntax=docker/dockerfile:1
# Go Runner Docker Image - Version 2
# Optimized for security, performance, and resource management

FROM golang:1.21-alpine

# Install essential tools
RUN apk add --no-cache \
    git \
    ca-certificates \
    coreutils \
    musl-dev

# Create a non-root user for security
RUN adduser -D -s /bin/sh coderunner

# Set up Go environment
ENV GOOS=linux
ENV GOARCH=amd64
ENV CGO_ENABLED=0
ENV GO111MODULE=on

# Set up secure working directory
WORKDIR /app

# Create module directory structure and change ownership
RUN mkdir -p /app/src && chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD go version || exit 1

# Default entry point
CMD ["/bin/sh"]
