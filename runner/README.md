# Docker Runner Setup for Collaborative Code Editor

This directory contains the Dockerfiles and build scripts for the code execution environment.

## 🐳 Supported Languages

- **C** - GCC compiler with C17 standard support
- **C++** - GCC compiler with full C++17 support
- **Python** - Python 3.11 with standard libraries
- **Go** - Go 1.21 with module support
- **JavaScript/Node.js** - Node.js 20 with npm packages
- **TypeScript** - TypeScript with ts-node for direct execution
- **Rust** - Rust 1.70 with Cargo support
- **PHP** - PHP 8.2 CLI with standard extensions
- **Ruby** - Ruby 3.2 with standard gems

## 🚀 Quick Setup

### Windows
```cmd
cd runner
build-images.bat
```

### Linux/macOS
```bash
cd runner
chmod +x build-images.sh
./build-images.sh
```

## 🔧 Manual Build

If you prefer to build images individually:

```bash
# C Runner
docker build -f runner/c-runner-v2.dockerfile -t c-runner:latest .

# C++ Runner
docker build -f runner/cpp-runner-v2.dockerfile -t cpp-runner:latest .

# Python Runner  
docker build -f runner/python-runner-v2.dockerfile -t python-runner:latest .

# Go Runner
docker build -f runner/go-runner-v2.dockerfile -t go-runner:latest .

# Node.js Runner
docker build -f runner/node-runner-v2.dockerfile -t node-runner:latest .

# TypeScript Runner
docker build -f runner/typescript-runner-v2.dockerfile -t typescript-runner:latest .

# Rust Runner
docker build -f runner/rust-runner-v2.dockerfile -t rust-runner:latest .

# PHP Runner
docker build -f runner/php-runner-v2.dockerfile -t php-runner:latest .

# Ruby Runner
docker build -f runner/ruby-runner-v2.dockerfile -t ruby-runner:latest .
```

## 🔒 Security Features

- **Non-root execution**: All containers run as unprivileged users
- **Network isolation**: No network access during code execution
- **Resource limits**: CPU and memory constraints
- **Read-only filesystem**: Root filesystem is read-only
- **Capability dropping**: All unnecessary capabilities removed
- **Secure tmpfs**: Temporary filesystems with security restrictions

## 📁 File Structure

```
runner/
├── build-images.sh/.bat     # Build all runner images
├── cleanup.sh/.bat          # Clean up old Docker images  
├── c-runner-v2.dockerfile        # C execution environment
├── cpp-runner-v2.dockerfile      # C++ execution environment
├── python-runner-v2.dockerfile   # Python execution environment
├── go-runner-v2.dockerfile       # Go execution environment
├── node-runner-v2.dockerfile     # Node.js execution environment
├── typescript-runner-v2.dockerfile # TypeScript execution environment
├── rust-runner-v2.dockerfile     # Rust execution environment
├── php-runner-v2.dockerfile      # PHP execution environment
├── ruby-runner-v2.dockerfile     # Ruby execution environment
└── README.md                      # This file
```

## 🐛 Troubleshooting

### Permission Issues
If you encounter permission errors, ensure Docker is running and your user has Docker permissions:

```bash
# Linux: Add user to docker group
sudo usermod -aG docker $USER
# Then log out and back in
```

### Image Build Failures
1. Ensure Docker is running
2. Check internet connection for downloading base images
3. Verify Dockerfile syntax

### Runtime Errors
1. Check if images are built: `docker images`
2. Verify container can run: `docker run --rm cpp-runner:latest echo "test"`
3. Check Docker daemon logs for detailed errors

## 🔄 Updating Images

To rebuild images after changes:

```bash
# Remove old images (optional)
docker rmi c-runner:latest cpp-runner:latest python-runner:latest go-runner:latest node-runner:latest typescript-runner:latest rust-runner:latest php-runner:latest ruby-runner:latest

# Or use cleanup script
./runner/cleanup.sh  # or cleanup.bat on Windows

# Rebuild
./build-images.sh  # or build-images.bat on Windows
```

## 🧹 **Docker Cleanup**

Use the cleanup scripts to free up disk space:

### **Windows**
```cmd
runner\cleanup.bat
```

### **Linux/macOS**  
```bash
chmod +x runner/cleanup.sh
./runner/cleanup.sh
```

This will remove:
- Dangling images
- Unused containers
- Unused networks
- Unused volumes
- Old runner image versions

## 📊 Performance Notes

- **Compilation time**: C++ compilation adds 1-3 seconds
- **Startup overhead**: Docker containers have ~100-200ms startup time
- **Memory usage**: Each execution uses 128MB max by default
- **CPU limits**: 0.5 CPU cores max per execution

## 🎯 Future Enhancements

- Add more language support (Java, C#, Kotlin, Swift)
- Implement custom package/library support
- Add interactive input/output support
- Implement persistent compilation caching
- Add language-specific linting and formatting
- Support for multiple file projects
