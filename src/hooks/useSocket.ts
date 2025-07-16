import { useState, useEffect, useCallback, useRef } from 'react';
import socketService from '../services/socketService';
import type { ConnectionState } from '../types';

/**
 * Custom hook for managing WebSocket connection
 * Features:
 * - Connection state management
 * - Auto-connect and reconnection handling
 * - Connection status tracking
 * - Error handling
 * - Stable connection management
 */
export function useSocket() {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    connected: false
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const connectAttempted = useRef(false);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(async () => {
    if (isConnecting || connectionState.connected) {
      console.log('🔌 Skipping connect - already connecting or connected');
      return;
    }

    setIsConnecting(true);
    setConnectionState(prev => ({ ...prev, error: undefined }));

    try {
      console.log('🔌 Attempting to connect...');
      const success = await socketService.connect();
      
      if (success) {
        console.log('✅ Connection successful');
        setConnectionState({
          connected: true,
          socketId: socketService.getStats().socketId
        });
      } else {
        console.log('❌ Connection failed');
        setConnectionState({
          connected: false,
          error: 'Failed to connect to server'
        });
      }
    } catch (error) {
      console.error('❌ Connection error:', error);
      setConnectionState({
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown connection error'
      });
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting, connectionState.connected]);

  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting socket...');
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    socketService.disconnect();
    setConnectionState({ connected: false });
  }, []);

  // Delayed reconnection to avoid rapid reconnect loops
  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    
    reconnectTimeoutRef.current = setTimeout(() => {
      console.log('🔌 Attempting scheduled reconnection...');
      connect();
    }, 2000);
  }, [connect]);

  // Set up event listeners
  useEffect(() => {
    console.log('🔌 Setting up socket event listeners...');
    
    const unsubscribeConnected = socketService.on('connected', () => {
      console.log('🔌 Socket connected event received');
      setConnectionState({
        connected: true,
        socketId: socketService.getStats().socketId
      });
    });

    const unsubscribeDisconnected = socketService.on('disconnected', ({ reason }) => {
      console.log('🔌 Socket disconnected:', reason);
      setConnectionState({
        connected: false,
        error: `Disconnected: ${reason}`
      });
      
      // Auto-reconnect for unexpected disconnections
      if (reason !== 'io server disconnect' && reason !== 'client namespace disconnect') {
        console.log('🔌 Scheduling auto-reconnection...');
        scheduleReconnect();
      }
    });

    const unsubscribeConnectionError = socketService.on('connection-error', ({ error }) => {
      console.log('🔌 Connection error received:', error);
      setConnectionState({
        connected: false,
        error: error
      });
      setIsConnecting(false);
    });

    const unsubscribeMaxReconnect = socketService.on('max-reconnect-attempts-reached', () => {
      console.log('🔌 Max reconnect attempts reached');
      setConnectionState({
        connected: false,
        error: 'Maximum reconnection attempts reached'
      });
    });

    return () => {
      console.log('🔌 Cleaning up socket event listeners...');
      unsubscribeConnected();
      unsubscribeDisconnected();
      unsubscribeConnectionError();
      unsubscribeMaxReconnect();
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [scheduleReconnect]);

  // Auto-connect on mount
  useEffect(() => {
    if (!connectAttempted.current) {
      console.log('🔌 Initial connection attempt...');
      connectAttempted.current = true;
      connect();
    }
    
    return () => {
      // Cleanup on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [connect]);

  return {
    connectionState,
    isConnecting,
    connect,
    disconnect,
    isConnected: connectionState.connected
  };
}
