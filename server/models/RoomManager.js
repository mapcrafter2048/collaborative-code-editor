const { v4: uuidv4 } = require('uuid');
const Room = require('./Room');

/**
 * RoomManager handles creation, management, and cleanup of collaboration rooms
 * Features:
 * - Room lifecycle management
 * - Automatic cleanup of inactive rooms
 * - User session tracking
 * - Room discovery and statistics
 */
class RoomManager {
  constructor() {
    this.rooms = new Map();
    this.userToRoom = new Map(); // userId -> roomId mapping
    this.socketToUser = new Map(); // socketId -> userId mapping
    
    // Cleanup inactive rooms every 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveRooms();
    }, 10 * 60 * 1000);

    console.log('🏠 RoomManager initialized');
  }

  /**
   * Create a new collaboration room
   */
  createRoom(language = 'javascript') {
    const roomId = this.generateRoomId();
    const room = new Room(roomId, language);
    
    this.rooms.set(roomId, room);
    console.log(`🏠 Created room ${roomId} with language ${language}`);
    
    return room;
  }

  /**
   * Get a room by ID
   */
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  /**
   * Join a user to a room
   */
  joinRoom(roomId, userId, socketId) {
    let room = this.getRoom(roomId);
    
    // Create room if it doesn't exist
    if (!room) {
      room = this.createRoom();
      room.id = roomId; // Use the requested room ID
      this.rooms.set(roomId, room);
    }

    // Remove user from any previous room
    this.leaveRoom(userId, socketId);

    // Add user to new room
    room.addUser(userId, socketId);
    this.userToRoom.set(userId, roomId);
    this.socketToUser.set(socketId, userId);

    return room;
  }

  /**
   * Remove a user from their current room
   */
  leaveRoom(userId, socketId) {
    const roomId = this.userToRoom.get(userId);
    
    if (roomId) {
      const room = this.getRoom(roomId);
      if (room) {
        const shouldCleanup = room.removeUser(userId);
        
        // Remove empty rooms
        if (shouldCleanup) {
          this.rooms.delete(roomId);
          console.log(`🗑️ Removed empty room ${roomId}`);
        }
      }
      
      this.userToRoom.delete(userId);
    }
    
    this.socketToUser.delete(socketId);
  }

  /**
   * Get room by user ID
   */
  getRoomByUser(userId) {
    const roomId = this.userToRoom.get(userId);
    return roomId ? this.getRoom(roomId) : null;
  }

  /**
   * Get room by socket ID
   */
  getRoomBySocket(socketId) {
    const userId = this.socketToUser.get(socketId);
    return userId ? this.getRoomByUser(userId) : null;
  }

  /**
   * Get user ID by socket ID
   */
  getUserBySocket(socketId) {
    return this.socketToUser.get(socketId);
  }

  /**
   * Get all users in a room
   */
  getRoomUsers(roomId) {
    const room = this.getRoom(roomId);
    return room ? Array.from(room.users) : [];
  }

  /**
   * Broadcast message to all users in a room
   */
  broadcastToRoom(roomId, event, data, excludeUserId = null) {
    const room = this.getRoom(roomId);
    if (!room) return;

    const users = Array.from(room.users);
    return users.filter(userId => userId !== excludeUserId);
  }

  /**
   * Generate a unique room ID
   */
  generateRoomId() {
    let roomId;
    do {
      // Generate a shorter, more readable room ID
      roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    } while (this.rooms.has(roomId));
    
    return roomId;
  }

  /**
   * Cleanup inactive rooms
   */
  cleanupInactiveRooms(maxInactiveMinutes = 60) {
    const before = this.rooms.size;
    
    for (const [roomId, room] of this.rooms.entries()) {
      if (room.isEmpty() || room.isStale(maxInactiveMinutes)) {
        // Clean up user mappings for this room
        for (const userId of room.users) {
          this.userToRoom.delete(userId);
        }
        
        this.rooms.delete(roomId);
        console.log(`🗑️ Cleaned up inactive room ${roomId}`);
      }
    }
    
    const after = this.rooms.size;
    if (before !== after) {
      console.log(`🧹 Cleanup complete: ${before - after} rooms removed`);
    }
  }

  /**
   * Get statistics about rooms and users
   */
  getStats() {
    const totalRooms = this.rooms.size;
    const totalUsers = this.userToRoom.size;
    const roomsByLanguage = {};
    
    for (const room of this.rooms.values()) {
      roomsByLanguage[room.language] = (roomsByLanguage[room.language] || 0) + 1;
    }
    
    return {
      totalRooms,
      totalUsers,
      roomsByLanguage,
      averageUsersPerRoom: totalRooms > 0 ? totalUsers / totalRooms : 0
    };
  }

  /**
   * Get room count
   */
  getRoomCount() {
    return this.rooms.size;
  }

  /**
   * Get total user count across all rooms
   */
  getTotalUserCount() {
    return this.userToRoom.size;
  }

  /**
   * List all active rooms (for debugging/admin)
   */
  listRooms() {
    return Array.from(this.rooms.values()).map(room => ({
      id: room.id,
      language: room.language,
      userCount: room.users.size,
      createdAt: room.createdAt,
      lastActivity: room.lastActivity
    }));
  }

  /**
   * Cleanup on shutdown
   */
  shutdown() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    console.log('🏠 RoomManager shutdown complete');
  }
}

module.exports = RoomManager;
