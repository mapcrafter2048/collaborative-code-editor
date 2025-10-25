# Docker Runner Setup for Collaborative Code Editor

This directory contains the Dockerfiles and build scripts for the code execution environment.

## 🐳 Supported Languages

- **Python** - Python 3.11 with standard libraries
- **JavaScript** - Node.js 20 with npm ecosystem
- **TypeScript** - Node.js 20 + tsx runtime (fast TypeScript execution without compilation)

## 🚀 Quick Setup

```bash
cd runner
chmod +x build-images.sh
./build-images.sh
```

This builds all three runner images:

- `python-runner:latest`
- `node-runner:latest`
- `typescript-runner:latest`

## 🔧 Manual Build

If you prefer to build images individually:

```bash
# Python Runner
docker build -f python-runner-v2.dockerfile -t python-runner:latest .

# Node.js Runner
docker build -f node-runner-v2.dockerfile -t node-runner:latest .

# TypeScript Runner
docker build -f typescript-runner-v2.dockerfile -t typescript-runner:latest .
```

## 🔒 Security Features

- **Non-root execution**: All containers run as unprivileged users (`coderunner`)
- **Network isolation**: `--network none` prevents external access
- **Resource limits**: CPU (1.0 core) and memory (256MB) constraints
- **Capability dropping**: `--cap-drop ALL` removes all capabilities
- **Security options**: `no-new-privileges` prevents privilege escalation
- **Timeout enforcement**: Commands run with `timeout` to prevent runaway processes

## 📁 File Structure

```
runner/
├── build-images.sh              # Build all runner images
├── python-runner-v2.dockerfile  # Python 3.11 execution environment
├── node-runner-v2.dockerfile    # Node.js 20 execution environment
├── typescript-runner-v2.dockerfile # TypeScript (tsx) execution environment
└── README.md                    # This file
```

## ⚙️ Runtime Details

### Python Runner

- **Base**: `python:3.11-slim`
- **Timeout**: 10 seconds
- **Command**: `timeout 10s python code.py`

### Node.js Runner

- **Base**: `node:20-alpine`
- **Timeout**: 10 seconds
- **Command**: `timeout 10s node code.js`

### TypeScript Runner

- **Base**: `node:20-alpine`
- **Runtime**: `tsx` (fast TypeScript execution)
- **Timeout**: 300 seconds (5 minutes)
- **Command**: `timeout 300s tsx --tsconfig tsconfig.json code.ts`
- **Features**:
  - No compilation step required
  - Supports both CommonJS and ESM
  - Auto-generates `tsconfig.json` per execution
  - Faster than `ts-node` for typical scripts

## 🐛 Troubleshooting

### Permission Issues

Ensure Docker is running and your user has Docker permissions:

```bash
# Linux: Add user to docker group
sudo usermod -aG docker $USER
# Then log out and back in
```

### Image Build Failures

1. Ensure Docker is running: `docker ps`
2. Check internet connection for downloading base images
3. Verify Dockerfile syntax

### Runtime Errors

1. Check if images are built: `docker images | grep runner`
2. Verify container can run: `docker run --rm python-runner:latest python --version`
3. Check Docker daemon logs for detailed errors

### TypeScript Execution Issues

If you see `ERR_UNKNOWN_FILE_EXTENSION` errors:

1. Rebuild the TypeScript runner: `./build-images.sh`
2. Verify `tsx` is installed: `docker run --rm typescript-runner:latest tsx --version`
3. Restart the backend server to reload the service

## 🔄 Updating Images

To rebuild images after changes:

```bash
# Remove old images (optional)
docker rmi python-runner:latest node-runner:latest typescript-runner:latest

# Rebuild
./build-images.sh
```

## 📊 Performance Notes

- **Startup overhead**: Docker containers have ~100-300ms startup time
- **Memory usage**: Each execution uses 256MB max by default
- **CPU limits**: 1.0 CPU core max per execution
- **TypeScript**: `tsx` runtime provides near-instant transpilation without separate compilation step

## 🎯 Key Differences from Traditional Setups

### TypeScript Execution

- **Old approach**: `ts-node` (requires Node.js loader, slower)
- **New approach**: `tsx` (faster, better ESM support, no loader issues)
- **Benefit**: Eliminates `ERR_UNKNOWN_FILE_EXTENSION` errors and improves performance

### Security Hardening

All runners use:

- Alpine Linux (smaller attack surface)
- Non-root user execution
- Network isolation
- Dropped capabilities
- Resource constraints
