const { v4: uuidv4 } = require('uuid');

/**
 * SocketHandler manages WebSocket connections and real-time collaboration events
 * Features:
 * - Real-time code synchronization
 * - User presence management
 * - Code execution coordination
 * - Room management via WebSocket
 * - Cursor position tracking
 * - Language switching
 */
class SocketHandler {
  constructor(io, roomManager, dockerService) {
    this.io = io;
    this.roomManager = roomManager;
    this.dockerService = dockerService;
    this.activeConnections = new Map(); // socketId -> connection info
    
    console.log('🔌 SocketHandler initialized');
  }

  /**
   * Initialize socket event handlers
   */
  initialize() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 Client connected: ${socket.id}`);
      
      // Store connection info
      this.activeConnections.set(socket.id, {
        connectedAt: new Date(),
        userId: null,
        roomId: null
      });

      // Register event handlers
      this.registerJoinRoom(socket);
      this.registerLeaveRoom(socket);
      this.registerCodeChange(socket);
      this.registerCursorMove(socket);
      this.registerLanguageChange(socket);
      this.registerCodeExecution(socket);
      this.registerGetRoomState(socket);
      this.registerDisconnect(socket);

      // Send initial connection confirmation
      socket.emit('connected', {
        socketId: socket.id,
        timestamp: new Date().toISOString(),
        supportedLanguages: this.dockerService.getSupportedLanguages()
      });
    });
  }

  /**
   * Handle room joining
   */
  registerJoinRoom(socket) {
    socket.on('join-room', (data) => {
      try {
        const { roomId, userId = uuidv4(), username = 'Anonymous' } = data;
        
        console.log(`👤 User ${userId} (${username}) joining room ${roomId}`);

        // Join the room
        const room = this.roomManager.joinRoom(roomId, userId, socket.id);
        
        // Join socket to room for broadcasting
        socket.join(roomId);
        
        // Update connection info
        const connectionInfo = this.activeConnections.get(socket.id);
        if (connectionInfo) {
          connectionInfo.userId = userId;
          connectionInfo.roomId = roomId;
          connectionInfo.username = username;
        }

        // Send room state to the joining user
        socket.emit('room-joined', {
          success: true,
          roomId: room.id,
          userId,
          roomState: room.getState(),
          message: `Joined room ${roomId} successfully`
        });

        // Notify other users in the room
        socket.to(roomId).emit('user-joined', {
          userId,
          username,
          userCount: room.users.size,
          timestamp: new Date().toISOString()
        });

        // Send updated user list to all users
        this.broadcastUserList(roomId);

      } catch (error) {
        console.error('❌ Error joining room:', error);
        socket.emit('room-join-error', {
          success: false,
          error: error.message
        });
      }
    });
  }

  /**
   * Handle room leaving
   */
  registerLeaveRoom(socket) {
    socket.on('leave-room', () => {
      this.handleUserLeave(socket);
    });
  }

  /**
   * Handle code changes
   */
  registerCodeChange(socket) {
    socket.on('code-change', (data) => {
      try {
        const { code, roomId } = data;
        const userId = this.roomManager.getUserBySocket(socket.id);
        
        if (!userId || !roomId) {
          socket.emit('error', { message: 'User not in any room' });
          return;
        }

        const room = this.roomManager.getRoom(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Update room code
        room.updateCode(code, userId);

        // Broadcast code change to other users in the room
        socket.to(roomId).emit('code-changed', {
          code,
          userId,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('❌ Error handling code change:', error);
        socket.emit('error', { message: 'Failed to update code' });
      }
    });
  }

  /**
   * Handle cursor movement
   */
  registerCursorMove(socket) {
    socket.on('cursor-move', (data) => {
      try {
        const { position, selection, roomId } = data;
        const userId = this.roomManager.getUserBySocket(socket.id);
        
        if (!userId || !roomId) return;

        const room = this.roomManager.getRoom(roomId);
        if (!room) return;

        // Update cursor position in room
        room.updateCursor(userId, { position, selection });

        // Broadcast cursor position to other users
        socket.to(roomId).emit('cursor-moved', {
          userId,
          position,
          selection,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('❌ Error handling cursor move:', error);
      }
    });
  }

  /**
   * Handle language changes
   */
  registerLanguageChange(socket) {
    socket.on('language-change', (data) => {
      try {
        const { language, roomId } = data;
        const userId = this.roomManager.getUserBySocket(socket.id);
        
        if (!userId || !roomId) {
          socket.emit('error', { message: 'User not in any room' });
          return;
        }

        if (!this.dockerService.isLanguageSupported(language)) {
          socket.emit('error', { message: `Unsupported language: ${language}` });
          return;
        }

        const room = this.roomManager.getRoom(roomId);
        if (!room) {
          socket.emit('error', { message: 'Room not found' });
          return;
        }

        // Change room language
        room.changeLanguage(language, userId);

        // Broadcast language change to all users in the room
        this.io.to(roomId).emit('language-changed', {
          language,
          code: room.code,
          userId,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('❌ Error handling language change:', error);
        socket.emit('error', { message: 'Failed to change language' });
      }
    });
  }

  /**
   * Handle code execution requests
   */
  registerCodeExecution(socket) {
    socket.on('execute-code', async (data) => {
      try {
        const { roomId, timeout } = data;
        const userId = this.roomManager.getUserBySocket(socket.id);
        
        if (!userId || !roomId) {
          socket.emit('execution-error', { message: 'User not in any room' });
          return;
        }

        const room = this.roomManager.getRoom(roomId);
        if (!room) {
          socket.emit('execution-error', { message: 'Room not found' });
          return;
        }

        console.log(`🚀 Code execution requested by ${userId} in room ${roomId}`);

        // Notify all users that execution started
        this.io.to(roomId).emit('execution-started', {
          userId,
          language: room.language,
          timestamp: new Date().toISOString()
        });

        // Execute the code
        const result = await this.dockerService.executeCode(
          room.code,
          room.language,
          roomId,
          timeout
        );

        // Send result to all users in the room
        this.io.to(roomId).emit('execution-result', {
          ...result,
          userId,
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('❌ Error executing code:', error);
        
        const userId = this.roomManager.getUserBySocket(socket.id);
        const roomId = this.activeConnections.get(socket.id)?.roomId;
        
        if (roomId) {
          this.io.to(roomId).emit('execution-error', {
            message: 'Code execution failed',
            error: error.message,
            userId,
            timestamp: new Date().toISOString()
          });
        }
      }
    });
  }

  /**
   * Handle room state requests
   */
  registerGetRoomState(socket) {
    socket.on('get-room-state', () => {
      try {
        const userId = this.roomManager.getUserBySocket(socket.id);
        const room = this.roomManager.getRoomBySocket(socket.id);
        
        if (!room) {
          socket.emit('error', { message: 'User not in any room' });
          return;
        }

        socket.emit('room-state', {
          ...room.getState(),
          timestamp: new Date().toISOString()
        });

      } catch (error) {
        console.error('❌ Error getting room state:', error);
        socket.emit('error', { message: 'Failed to get room state' });
      }
    });
  }

  /**
   * Handle user disconnection
   */
  registerDisconnect(socket) {
    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
      this.handleUserLeave(socket);
      this.activeConnections.delete(socket.id);
    });
  }

  /**
   * Handle user leaving (disconnect or explicit leave)
   */
  handleUserLeave(socket) {
    try {
      const userId = this.roomManager.getUserBySocket(socket.id);
      const connectionInfo = this.activeConnections.get(socket.id);
      
      if (userId && connectionInfo?.roomId) {
        const roomId = connectionInfo.roomId;
        const room = this.roomManager.getRoom(roomId);
        
        // Leave socket room
        socket.leave(roomId);
        
        // Remove user from room
        this.roomManager.leaveRoom(userId, socket.id);
        
        // Notify other users
        socket.to(roomId).emit('user-left', {
          userId,
          username: connectionInfo.username,
          userCount: room ? room.users.size : 0,
          timestamp: new Date().toISOString()
        });

        // Send updated user list
        this.broadcastUserList(roomId);
      }
    } catch (error) {
      console.error('❌ Error handling user leave:', error);
    }
  }

  /**
   * Broadcast updated user list to all users in a room
   */
  broadcastUserList(roomId) {
    try {
      const room = this.roomManager.getRoom(roomId);
      if (!room) return;

      const userList = Array.from(room.users).map(userId => {
        // Find connection info for this user
        const connection = Array.from(this.activeConnections.values())
          .find(conn => conn.userId === userId);
        
        return {
          userId,
          username: connection?.username || 'Anonymous',
          isOnline: !!connection
        };
      });

      this.io.to(roomId).emit('user-list-updated', {
        users: userList,
        userCount: userList.length,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('❌ Error broadcasting user list:', error);
    }
  }

  /**
   * Get statistics about active connections
   */
  getStats() {
    return {
      activeConnections: this.activeConnections.size,
      roomConnections: Array.from(this.activeConnections.values())
        .reduce((acc, conn) => {
          if (conn.roomId) {
            acc[conn.roomId] = (acc[conn.roomId] || 0) + 1;
          }
          return acc;
        }, {}),
      totalRooms: this.roomManager.getRoomCount(),
      totalUsers: this.roomManager.getTotalUserCount()
    };
  }

  /**
   * Broadcast message to all connected clients
   */
  broadcastToAll(event, data) {
    this.io.emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Send message to specific room
   */
  sendToRoom(roomId, event, data) {
    this.io.to(roomId).emit(event, {
      ...data,
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = SocketHandler;
