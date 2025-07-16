# Ruby Runner for Collaborative Code Editor
FROM ruby:3.2-alpine

# Set working directory
WORKDIR /app

# Create a non-root user for security
RUN adduser -D -s /bin/sh coderunner

# Set proper permissions
RUN chown -R coderunner:coderunner /app

# Switch to non-root user
USER coderunner

# Default command - will be overridden by DockerExecutionService
CMD ["echo", "Ruby runner ready"]
