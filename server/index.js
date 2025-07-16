const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const RoomManager = require('./models/RoomManager');
const DockerExecutionService = require('./services/DockerExecutionService');
const SocketHandler = require('./handlers/SocketHandler');

/**
 * Main server application for the collaborative code editor
 * Features:
 * - Real-time collaboration via WebSocket
 * - Docker-based code execution
 * - Room-based code sharing
 * - Language support for C++, Python, and Go
 */
class CodeEditorServer {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.io = socketIo(this.server, {
      cors: {
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        methods: ["GET", "POST"]
      }
    });

    this.roomManager = new RoomManager();
    this.dockerService = new DockerExecutionService();
    this.socketHandler = new SocketHandler(this.io, this.roomManager, this.dockerService);

    this.setupMiddleware();
    this.setupRoutes();
    this.setupSocketHandlers();
  }

  /**
   * Configure Express middleware
   */
  setupMiddleware() {
    this.app.use(cors({
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true
    }));
    this.app.use(express.json());
    this.app.use(express.static('public'));
  }

  /**
   * Setup REST API routes
   */
  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        timestamp: new Date().toISOString(),
        rooms: this.roomManager.getRoomCount(),
        activeUsers: this.roomManager.getTotalUserCount()
      });
    });

    // Get room information
    this.app.get('/api/rooms/:roomId', (req, res) => {
      const { roomId } = req.params;
      const room = this.roomManager.getRoom(roomId);
      
      if (!room) {
        return res.status(404).json({ error: 'Room not found' });
      }

      res.json({
        roomId: room.id,
        language: room.language,
        userCount: room.users.size,
        createdAt: room.createdAt
      });
    });

    // Create a new room
    this.app.post('/api/rooms', (req, res) => {
      const { language = 'javascript' } = req.body;
      const room = this.roomManager.createRoom(language);
      
      res.status(201).json({
        roomId: room.id,
        language: room.language,
        createdAt: room.createdAt
      });
    });

    // Fallback for undefined routes
    this.app.use('*', (req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });
  }

  /**
   * Setup WebSocket event handlers
   */
  setupSocketHandlers() {
    this.socketHandler.initialize();
  }

  /**
   * Start the server
   */
  start(port = process.env.PORT || 3001) {
    this.server.listen(port, () => {
      console.log(`🚀 Collaborative Code Editor Server running on port ${port}`);
      console.log(`📡 WebSocket server ready for real-time collaboration`);
      console.log(`🐳 Docker execution service initialized`);
      console.log(`📊 Health check available at: http://localhost:${port}/health`);
    });
  }

  /**
   * Graceful shutdown handler
   */
  shutdown() {
    console.log('🔄 Server shutting down gracefully...');
    
    // Close Socket.IO connections first
    this.io.close(() => {
      console.log('📡 Socket.IO connections closed');
      
      // Close HTTP server
      this.server.close(() => {
        console.log('✅ HTTP server closed');
        
        // Clean up room manager
        this.roomManager.shutdown();
        console.log('🧹 Room manager cleaned up');
        
        // Force exit after a timeout to prevent hanging
        setTimeout(() => {
          console.log('⚠️ Force exit due to timeout');
          process.exit(0);
        }, 2000);
        
        process.exit(0);
      });
    });
    
    // Force shutdown after 5 seconds if graceful shutdown fails
    setTimeout(() => {
      console.log('⚠️ Force shutdown due to timeout');
      process.exit(1);
    }, 5000);
  }
}

// Initialize and start server
const server = new CodeEditorServer();

// Handle graceful shutdown
process.on('SIGTERM', () => server.shutdown());
process.on('SIGINT', () => server.shutdown());

// Start the server
server.start();

module.exports = CodeEditorServer;
