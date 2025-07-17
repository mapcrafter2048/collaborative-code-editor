# Server Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install Docker CLI (for Docker execution service)
RUN apk add --no-cache docker-cli

# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Create a non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Change ownership of the app directory to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

EXPOSE 8080

ENV NODE_ENV=production
ENV PORT=8080

CMD ["npm", "start"]
