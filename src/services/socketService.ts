import { io, Socket } from 'socket.io-client';
import type { 
  SocketEvents, 
  Language, 
  Room, 
  User, 
  ExecutionResult,
  CursorPosition,
  Selection
} from '../types';

/**
 * SocketService manages WebSocket connection and real-time communication
 * Features:
 * - Connection management with auto-reconnection
 * - Event handling with TypeScript support
 * - Room operations
 * - Real-time code synchronization
 * - User presence tracking
 */
class SocketService {
  private socket: Socket | null = null;
  private serverUrl: string;
  private isConnecting: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private eventListeners: Map<string, Set<Function>> = new Map();

  constructor(serverUrl: string = 'http://localhost:3001') {
    this.serverUrl = serverUrl;
    console.log('🔌 SocketService initialized');
  }

  /**
   * Establish connection to the server
   */
  async connect(): Promise<boolean> {
    if (this.socket?.connected) {
      console.log('🔌 Already connected');
      return true;
    }

    if (this.isConnecting) {
      console.log('🔌 Connection already in progress');
      return false;
    }

    try {
      this.isConnecting = true;
      console.log(`🔌 Connecting to ${this.serverUrl}...`);

      this.socket = io(this.serverUrl, {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      });

      console.log('🔌 Socket.IO instance created with options:', {
        url: this.serverUrl,
        transports: ['websocket', 'polling'],
        timeout: 20000
      });

      return new Promise((resolve) => {
        if (!this.socket) {
          resolve(false);
          return;
        }

        this.socket.on('connect', () => {
          console.log('✅ Connected to server');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emitToListeners('connected', { connected: true });
          resolve(true);
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error);
          console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
            toString: error.toString()
          });
          this.isConnecting = false;
          this.emitToListeners('connection-error', { error: error.message });
          resolve(false);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Disconnected:', reason);
          this.emitToListeners('disconnected', { reason });
          
          // Auto-reconnect for certain disconnect reasons
          if (reason === 'io server disconnect') {
            // Server disconnected us, don't auto-reconnect
            return;
          }
          
          this.handleReconnection();
        });

        // Set up event forwarding
        this.setupEventForwarding();
      });

    } catch (error) {
      console.error('❌ Failed to connect:', error);
      this.isConnecting = false;
      return false;
    }
  }

  /**
   * Disconnect from the server
   */
  disconnect(): void {
    if (this.socket) {
      console.log('🔌 Disconnecting...');
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnecting = false;
    this.reconnectAttempts = 0;
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  /**
   * Handle automatic reconnection
   */
  private async handleReconnection(): Promise<void> {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      this.emitToListeners('max-reconnect-attempts-reached', {});
      return;
    }

    this.reconnectAttempts++;
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  /**
   * Set up event forwarding from socket to listeners
   */
  private setupEventForwarding(): void {
    if (!this.socket) return;

    // Forward all socket events to registered listeners
    const events = [
      'connected',
      'room-joined',
      'room-join-error', 
      'user-joined',
      'user-left',
      'user-list-updated',
      'code-changed',
      'cursor-moved',
      'language-changed',
      'execution-started',
      'execution-result',
      'execution-error',
      'room-state',
      'error'
    ];

    events.forEach(event => {
      this.socket?.on(event, (data) => {
        this.emitToListeners(event, data);
      });
    });
  }

  /**
   * Emit event to registered listeners
   */
  private emitToListeners(event: string, data: any): void {
    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`❌ Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Add event listener
   */
  on(event: string, listener: Function): () => void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    
    this.eventListeners.get(event)!.add(listener);
    
    // Return unsubscribe function
    return () => {
      const listeners = this.eventListeners.get(event);
      if (listeners) {
        listeners.delete(listener);
        if (listeners.size === 0) {
          this.eventListeners.delete(event);
        }
      }
    };
  }

  /**
   * Remove event listener
   */
  off(event: string, listener?: Function): void {
    if (!listener) {
      this.eventListeners.delete(event);
      return;
    }

    const listeners = this.eventListeners.get(event);
    if (listeners) {
      listeners.delete(listener);
      if (listeners.size === 0) {
        this.eventListeners.delete(event);
      }
    }
  }

  /**
   * Room operations
   */
  joinRoom(roomId: string, userId?: string, username?: string): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    console.log(`🏠 Joining room ${roomId}`);
    this.socket.emit('join-room', { roomId, userId, username });
  }

  leaveRoom(): void {
    if (!this.socket?.connected) return;

    console.log('🏠 Leaving current room');
    this.socket.emit('leave-room');
  }

  /**
   * Code operations
   */
  sendCodeChange(code: string, roomId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit('code-change', { code, roomId });
  }

  sendCursorMove(position: CursorPosition, selection: Selection | undefined, roomId: string): void {
    if (!this.socket?.connected) return;

    this.socket.emit('cursor-move', { position, selection, roomId });
  }

  changeLanguage(language: string, roomId: string): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    console.log(`🔄 Changing language to ${language} in room ${roomId}`);
    this.socket.emit('language-change', { language, roomId });
  }

  executeCode(roomId: string, timeout?: number): void {
    if (!this.socket?.connected) {
      throw new Error('Not connected to server');
    }

    console.log(`🚀 Executing code in room ${roomId}`);
    this.socket.emit('execute-code', { roomId, timeout });
  }

  getRoomState(): void {
    if (!this.socket?.connected) return;

    this.socket.emit('get-room-state');
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      connected: this.isConnected(),
      socketId: this.socket?.id,
      reconnectAttempts: this.reconnectAttempts,
      serverUrl: this.serverUrl,
      eventListeners: Array.from(this.eventListeners.keys())
    };
  }
}

// Create singleton instance
const socketService = new SocketService();

export default socketService;
