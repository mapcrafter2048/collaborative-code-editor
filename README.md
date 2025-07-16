# 🚀 Collaborative Code Editor

A clean and extensible collaborative code editor web application that allows users to create and join shared rooms for real-time code editing. Built with React, Next.js, Monaco Editor, and Docker execution capabilities.

## ✨ Features

### 🔄 Real-time Collaboration
- **Shared Rooms**: Create or join coding rooms with unique IDs
- **Live Code Sync**: Real-time code editing with conflict-free collaboration
- **User Presence**: See who's online with colored avatars and status indicators
- **Cursor Tracking**: View other users' cursor positions and selections in real-time

### 💻 Code Editing
- **Monaco Editor**: Full-featured code editor with syntax highlighting
- **Multi-language Support**: C++, Python, Go, and JavaScript
- **IntelliSense**: Auto-completion, error detection, and code suggestions
- **Customizable Themes**: Dark/light themes with customizable appearance

### 🐳 Secure Code Execution
- **Docker Isolation**: Code runs in isolated Docker containers
- **Resource Constraints**: Memory and CPU limits for safety
- **Timeout Protection**: Automatic termination of long-running processes
- **Multi-language Support**: Compilation and execution for different languages

### 🎨 Modern UI/UX
- **ShadCN Components**: Beautiful, accessible UI components
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Real-time Feedback**: Instant visual feedback for all actions
- **Intuitive Interface**: Clean, distraction-free coding environment

## 🏗️ Architecture

```
├── Frontend (Next.js + React)
│   ├── Monaco Editor Integration
│   ├── WebSocket Client
│   ├── Real-time Collaboration
│   └── ShadCN UI Components
│
├── Backend (Node.js + Express)
│   ├── WebSocket Server (Socket.IO)
│   ├── Room Management
│   ├── User Session Handling
│   └── REST API Endpoints
│
└── Docker Execution Service
    ├── Language-specific Containers
    ├── Resource Management
    ├── Security Isolation
    └── Result Processing
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **React 19** - Modern React with hooks and concurrent features
- **Monaco Editor** - VS Code's editor for the web
- **Socket.IO Client** - Real-time WebSocket communication
- **ShadCN UI** - Beautiful, accessible UI components
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe development

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **UUID** - Unique identifier generation

### Infrastructure
- **Docker** - Containerized code execution
- **Local Images**: `gcc:latest`, `python:3.11-slim`, `golang:1.21-alpine`

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Docker** (with the required images)

### Docker Images Setup
Pull the required Docker images:
```bash
docker pull gcc:latest
docker pull python:3.11-slim
docker pull golang:1.21-alpine
```

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd code-editor
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install server dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Start the backend server**
   ```bash
   cd server
   npm run dev
   ```
   The server will start on `http://localhost:3001`

5. **Start the frontend development server**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## 📖 Usage

### Creating/Joining a Room

1. **Enter your name** and optionally a **room ID**
2. **Generate a random room ID** using the dice button
3. **Click "Join Room"** to enter the collaborative session

### Collaborative Editing

- **Type code** in the Monaco editor - changes sync in real-time
- **Switch languages** using the dropdown (resets code with template)
- **See other users** in the sidebar with their online status
- **View cursors** of other users as they edit

### Code Execution

1. **Click "Run Code"** to execute the current code
2. **View results** in the execution panel below the editor
3. **See execution time** and any errors or output
4. **All users** in the room see the execution results

### Sharing Rooms

- **Copy Room ID** using the copy button in the header
- **Share URL** using the share button (native sharing on mobile)
- **Direct links** work with room parameter: `?room=ROOMID`

## 🔧 Configuration

### Environment Variables

Create `.env.local` in the project root:
```env
# Server URL (optional, defaults to localhost:3001)
NEXT_PUBLIC_SERVER_URL=http://localhost:3001

# Server configuration
PORT=3001
CLIENT_URL=http://localhost:3000
```

### Docker Execution Limits

The default execution limits can be modified in `server/services/DockerExecutionService.js`:
```javascript
this.defaultTimeout = 10000; // 10 seconds
this.maxMemory = '128m';      // 128 MB
this.maxCpus = '0.5';         // 0.5 CPU cores
```

## 📁 Project Structure

```
code-editor/
├── src/
│   ├── app/                 # Next.js App Router
│   ├── components/          # React components
│   │   ├── ui/             # ShadCN UI components
│   │   ├── CodeEditor.tsx  # Monaco Editor wrapper
│   │   ├── CollaborativeEditor.tsx  # Main editor
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   ├── services/           # API and Socket services
│   ├── types/              # TypeScript definitions
│   └── lib/                # Utility functions
├── server/
│   ├── index.js            # Main server file
│   ├── models/             # Data models
│   ├── services/           # Business logic
│   └── handlers/           # WebSocket handlers
└── public/                 # Static assets
```

## 🔒 Security Features

### Code Execution Security
- **Container Isolation**: Each execution runs in a separate Docker container
- **Resource Limits**: Memory, CPU, and time constraints
- **Network Isolation**: No network access during execution
- **Read-only Filesystem**: Prevents file system modifications
- **Unprivileged User**: Code runs as `nobody` user

### WebSocket Security
- **CORS Protection**: Configured for specific origins
- **Connection Limits**: Automatic cleanup of inactive connections
- **Input Validation**: All user inputs are validated and sanitized

## 🐛 Troubleshooting

### Common Issues

**Docker not found**
```bash
# Ensure Docker is installed and running
docker --version
docker ps
```

**WebSocket connection failed**
- Check if the server is running on port 3001
- Verify firewall settings
- Ensure CORS is properly configured

**Monaco Editor not loading**
- Check browser console for errors
- Verify all dependencies are installed
- Clear browser cache and reload

**Code execution timeout**
- Check Docker container status
- Verify Docker images are available
- Increase timeout limits if needed

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

---

**Built with ❤️ for collaborative coding**
