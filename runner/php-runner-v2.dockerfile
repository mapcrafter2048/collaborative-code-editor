# PHP Runner for Collaborative Code Editor
FROM php:8.2-cli-alpine

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN adduser -D -s /bin/sh coderunner

# Set proper permissions
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Default command - will be overridden by DockerExecutionService
CMD ["echo", "PHP runner ready"]
