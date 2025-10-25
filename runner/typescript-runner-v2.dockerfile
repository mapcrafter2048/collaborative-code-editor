# syntax=docker/dockerfile:1
# TypeScript Runner Docker Image - Version 2
# Optimized for security, performance, and resource management

FROM node:20-alpine

# Install essential tools and TypeScript globally
RUN apk add --no-cache \
    coreutils \
    && npm install -g typescript ts-node tsx @types/node

# Create a non-root user for security
RUN adduser -D -s /bin/sh coderunner

# Set up secure working directory
WORKDIR /app

# Create a basic tsconfig.json with proper ownership
RUN echo '{"compilerOptions":{"target":"ES2020","module":"commonjs","strict":true,"esModuleInterop":true,"skipLibCheck":true,"forceConsistentCasingInFileNames":true},"ts-node":{"esm":false}}' > tsconfig.json

# Change ownership of the app directory to the non-root user
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node --version && tsc --version || exit 1

# Default entry point
CMD ["/bin/sh"]
