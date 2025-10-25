# Collaborative Code Editor - Quick Start Guide

## 🎯 What's New

This revamped version focuses on **3 modern languages**:

- 🐍 **Python** - Most popular scripting language
- 📦 **JavaScript** - Web standard
- 📘 **TypeScript** - Type-safe JavaScript

## 🚀 Quick Setup (Recommended)

Just run the automated setup script:

```bash
chmod +x setup.sh
./setup.sh
```

This will:

- ✅ Check prerequisites (Node.js, Docker)
- ✅ Install all dependencies
- ✅ Build Docker images
- ✅ Verify setup

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Docker** ([Download](https://www.docker.com/get-started))

## 🏃 Running the Application

### Start Backend Server

```bash
cd server
npm run dev
```

Server runs on: `http://localhost:3001`

### Start Frontend (in another terminal)

```bash
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 🐳 Docker Images

The application uses 3 custom Docker images for secure code execution:

- `python-runner:latest` - Python 3.11
- `node-runner:latest` - Node.js 20
- `typescript-runner:latest` - TypeScript with ts-node

### Rebuild Images

```bash
cd runner
./build-images.sh
```

## 📖 Features

### Real-time Collaboration

- Create or join rooms with unique IDs
- See other users online
- Real-time code synchronization
- User presence indicators

### Code Editing

- Monaco Editor (VS Code engine)
- Syntax highlighting
- Auto-completion
- Error detection
- Dark/Light themes

### Code Execution

- Secure Docker isolation
- 10-second timeout
- Memory limits (256MB)
- CPU limits (1.0 core)
- Real-time output

## 🔧 Development

### Project Structure

```
collaborative-code-editor/
├── src/               # Frontend (Next.js + React)
├── server/            # Backend (Node.js + Express)
├── runner/            # Docker configurations
└── public/            # Static assets
```

### Key Files

- `src/components/CollaborativeEditor.tsx` - Main editor component
- `server/services/DockerExecutionService.js` - Code execution service
- `server/handlers/SocketHandler.js` - WebSocket event handlers
- `runner/build-images.sh` - Docker build script

## 🔒 Security Features

- **Container Isolation**: Each execution in separate container
- **Resource Limits**: Memory, CPU, and time constraints
- **Network Isolation**: No network access during execution
- **Secure Random**: Cryptographically secure random IDs
- **Path Validation**: Protected temp directory cleanup

## 🐛 Troubleshooting

### Docker Not Running

```bash
docker --version
docker ps
```

### Server Connection Failed

- Check if server is running on port 3001
- Verify firewall settings
- Check CORS configuration

### Code Execution Timeout

- Increase timeout in `DockerExecutionService.js`
- Check Docker container status
- Verify Docker images are built

## 📚 API Reference

### REST Endpoints

- `GET /health` - Health check
- `GET /api/rooms/:roomId` - Get room info
- `POST /api/rooms` - Create new room

### WebSocket Events

- `join-room` - Join a coding room
- `leave-room` - Leave current room
- `code-change` - Broadcast code changes
- `execute-code` - Run code in Docker
- `language-change` - Switch language

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - See LICENSE file for details

## 🙏 Acknowledgments

Built with:

- Next.js 15
- React 19
- Monaco Editor
- Socket.IO
- Docker
- Express

---

**Happy Coding! 🚀**

For detailed changes, see [REVAMP_SUMMARY.md](./REVAMP_SUMMARY.md)
