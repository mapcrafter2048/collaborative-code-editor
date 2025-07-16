import { useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import socketService from '../services/socketService';
import type { RoomState, User, Room } from '../types';

/**
 * Custom hook for managing room state and operations
 * Features:
 * - Room joining and leaving
 * - User management
 * - Real-time user list updates
 * - Room state synchronization
 * - Error handling
 */
export function useRoom() {
  const [roomState, setRoomState] = useState<RoomState>({
    room: null,
    users: [],
    currentUser: null,
    isJoining: false
  });

  const currentRoomId = useRef<string | null>(null);

  const joinRoom = useCallback(async (roomId: string, username: string = 'Anonymous') => {
    if (roomState.isJoining) {
      console.warn('Already joining a room');
      return false;
    }

    try {
      setRoomState(prev => ({ 
        ...prev, 
        isJoining: true, 
        error: undefined 
      }));

      const userId = uuidv4();
      
      console.log(`🏠 Attempting to join room ${roomId} as ${username}`);
      socketService.joinRoom(roomId, userId, username);
      
      currentRoomId.current = roomId;
      
      // Set current user immediately
      setRoomState(prev => ({
        ...prev,
        currentUser: { userId, username }
      }));

      return true;
    } catch (error) {
      console.error('Failed to join room:', error);
      setRoomState(prev => ({
        ...prev,
        isJoining: false,
        error: error instanceof Error ? error.message : 'Failed to join room'
      }));
      return false;
    }
  }, [roomState.isJoining]);

  const leaveRoom = useCallback(() => {
    if (!currentRoomId.current) {
      console.warn('Not in any room');
      return;
    }

    console.log(`🏠 Leaving room ${currentRoomId.current}`);
    socketService.leaveRoom();
    
    setRoomState({
      room: null,
      users: [],
      currentUser: null,
      isJoining: false
    });
    
    currentRoomId.current = null;
  }, []);

  const getRoomState = useCallback(() => {
    if (!currentRoomId.current) return;
    socketService.getRoomState();
  }, []);

  // Set up event listeners
  useEffect(() => {
    const unsubscribeRoomJoined = socketService.on('room-joined', (data: any) => {
      console.log('✅ Successfully joined room:', data);
      
      setRoomState(prev => ({
        ...prev,
        room: data.roomState,
        isJoining: false,
        error: undefined
      }));
    });

    const unsubscribeRoomJoinError = socketService.on('room-join-error', (data: any) => {
      console.error('❌ Failed to join room:', data.error);
      
      setRoomState(prev => ({
        ...prev,
        isJoining: false,
        error: data.error
      }));
      
      currentRoomId.current = null;
    });

    const unsubscribeUserJoined = socketService.on('user-joined', (data: any) => {
      console.log('👤 User joined:', data);
      
      setRoomState(prev => ({
        ...prev,
        room: prev.room ? {
          ...prev.room,
          userCount: data.userCount
        } : null
      }));
    });

    const unsubscribeUserLeft = socketService.on('user-left', (data: any) => {
      console.log('👤 User left:', data);
      
      setRoomState(prev => ({
        ...prev,
        room: prev.room ? {
          ...prev.room,
          userCount: data.userCount
        } : null
      }));
    });

    const unsubscribeUserListUpdated = socketService.on('user-list-updated', (data: any) => {
      console.log('👥 User list updated:', data);
      
      setRoomState(prev => ({
        ...prev,
        users: data.users
      }));
    });

    const unsubscribeRoomState = socketService.on('room-state', (data: any) => {
      console.log('🏠 Room state received:', data);
      
      setRoomState(prev => ({
        ...prev,
        room: {
          id: data.id,
          language: data.language,
          code: data.code,
          userCount: data.userCount,
          users: data.users,
          cursors: data.cursors,
          lastActivity: data.lastActivity,
          createdAt: data.createdAt
        }
      }));
    });

    const unsubscribeLanguageChanged = socketService.on('language-changed', (data: any) => {
      console.log('🔄 Language changed:', data);
      
      setRoomState(prev => ({
        ...prev,
        room: prev.room ? {
          ...prev.room,
          language: data.language,
          code: data.code
        } : null
      }));
    });

    const unsubscribeError = socketService.on('error', (data: any) => {
      console.error('❌ Room error:', data.message);
      
      setRoomState(prev => ({
        ...prev,
        error: data.message
      }));
    });

    return () => {
      unsubscribeRoomJoined();
      unsubscribeRoomJoinError();
      unsubscribeUserJoined();
      unsubscribeUserLeft();
      unsubscribeUserListUpdated();
      unsubscribeRoomState();
      unsubscribeLanguageChanged();
      unsubscribeError();
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (currentRoomId.current) {
        leaveRoom();
      }
    };
  }, [leaveRoom]);

  return {
    roomState,
    joinRoom,
    leaveRoom,
    getRoomState,
    isInRoom: !!roomState.room,
    currentRoomId: currentRoomId.current
  };
}
