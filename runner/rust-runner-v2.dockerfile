# syntax=docker/dockerfile:1
# Rust Runner Docker Image - Version 2
# Optimized for security, performance, and resource management

FROM rust:1.70-alpine

# Install essential tools
RUN apk add --no-cache \
    musl-dev \
    coreutils \
    gcc

# Create a non-root user for security
RUN adduser -D -s /bin/sh coderunner

# Set up secure working directory
WORKDIR /app

# Create a basic Cargo.toml for single file execution
RUN echo '[package]\nname = "code"\nversion = "0.1.0"\nedition = "2021"\n\n[[bin]]\nname = "code"\npath = "code.rs"' > Cargo.toml

# Change ownership of the app directory to the non-root user
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD rustc --version || exit 1

# Default entry point
CMD ["/bin/sh"]
