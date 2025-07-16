'use client';

import React, { useEffect, useState } from 'react';
import { useSocket } from '../hooks/useSocket';
import { useRoom } from '../hooks/useRoom';
import { useCodeEditor } from '../hooks/useCodeEditor';
import SimpleCodeEditor from './SimpleCodeEditor';
import RoomHeader from './RoomHeader';
import ExecutionPanel from './ExecutionPanel';
import UserList from './UserList';
import { Button } from './ui/button';
import type { Language, CursorPosition, Selection } from '../types';

/**
 * CollaborativeEditor - Main component that orchestrates real-time collaboration
 * Features:
 * - Real-time code synchronization
 * - User presence and cursor tracking
 * - Code execution with Docker containers
 * - Language switching
 * - Room management
 * - Responsive layout
 */
interface CollaborativeEditorProps {
  initialRoomId?: string;
  initialUsername?: string;
}

const CollaborativeEditor: React.FC<CollaborativeEditorProps> = ({
  initialRoomId,
  initialUsername = 'Anonymous'
}) => {
  // Hooks for managing state
  const { connectionState, isConnecting, connect } = useSocket();
  const { roomState, joinRoom, leaveRoom, isInRoom, currentRoomId } = useRoom();
  const { editorState, updateCode, updateCursor, changeLanguage, executeCode } = useCodeEditor(currentRoomId);

  // Local state
  const [joinRoomId, setJoinRoomId] = useState(initialRoomId || '');
  const [username, setUsername] = useState(initialUsername);
  const [availableLanguages] = useState<Language[]>([
    { id: 'cpp', name: 'C++', extension: '.cpp', requiresCompilation: true },
    { id: 'python', name: 'Python', extension: '.py', requiresCompilation: false },
    { id: 'javascript', name: 'JavaScript', extension: '.js', requiresCompilation: false }
  ]);

  // Auto-join room if provided in props
  useEffect(() => {
    if (initialRoomId && connectionState.connected && !isInRoom) {
      handleJoinRoom();
    }
  }, [initialRoomId, connectionState.connected, isInRoom]);

  // Event handlers
  const handleJoinRoom = async () => {
    if (!joinRoomId.trim()) {
      alert('Please enter a room ID');
      return;
    }

    if (!connectionState.connected) {
      alert('Not connected to server. Please wait...');
      return;
    }

    try {
      await joinRoom(joinRoomId.trim().toUpperCase(), username.trim());
    } catch (error) {
      console.error('Failed to join room:', error);
      alert('Failed to join room. Please try again.');
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    setJoinRoomId('');
  };

  const handleCodeChange = (newCode: string) => {
    updateCode(newCode);
  };

  const handleCursorChange = (position: CursorPosition) => {
    updateCursor(position);
  };

  const handleSelectionChange = (selection: Selection) => {
    updateCursor(
      { lineNumber: selection.startLineNumber, column: selection.startColumn },
      selection
    );
  };

  const handleLanguageChange = (newLanguage: string) => {
    if (window.confirm(`Switch to ${availableLanguages.find(l => l.id === newLanguage)?.name}? This will reset the code.`)) {
      changeLanguage(newLanguage);
    }
  };

  const handleExecuteCode = () => {
    executeCode();
  };

  const generateRoomId = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setJoinRoomId(result);
  };

  // Connection status component
  const ConnectionStatus = () => (
    <div className="flex items-center space-x-2 text-sm">
      <div className={`w-2 h-2 rounded-full ${
        connectionState.connected ? 'bg-green-500' : 'bg-red-500'
      } ${connectionState.connected ? 'animate-pulse' : ''}`} />
      <span className={connectionState.connected ? 'text-green-600' : 'text-red-600'}>
        {connectionState.connected ? 'Connected' : isConnecting ? 'Connecting...' : 'Disconnected'}
      </span>
      {connectionState.error && (
        <span className="text-red-500 text-xs">({connectionState.error})</span>
      )}
    </div>
  );

  // Room join form
  const RoomJoinForm = () => (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            🚀 Code Together
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time collaborative code editor
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Your Name
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your name"
              maxLength={20}
            />
          </div>

          <div>
            <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room ID
            </label>
            <div className="flex space-x-2">
              <input
                id="roomId"
                type="text"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter room ID"
                maxLength={6}
              />
              <Button
                onClick={generateRoomId}
                variant="outline"
                className="px-3 py-2"
                title="Generate random room ID"
              >
                🎲
              </Button>
            </div>
          </div>

          <Button
            onClick={handleJoinRoom}
            disabled={!connectionState.connected || !joinRoomId.trim() || roomState.isJoining}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md disabled:opacity-50"
          >
            {roomState.isJoining ? 'Joining...' : 'Join Room'}
          </Button>

          {roomState.error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-md">
              <span className="text-sm text-red-700 dark:text-red-300">
                ❌ {roomState.error}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <ConnectionStatus />
          {!connectionState.connected && !isConnecting && (
            <Button
              onClick={connect}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              Reconnect
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  // Main editor layout
  if (!isInRoom || !roomState.room) {
    return <RoomJoinForm />;
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <RoomHeader
        roomId={roomState.room.id}
        userCount={roomState.room.userCount}
        language={roomState.room.language}
        onLanguageChange={handleLanguageChange}
        availableLanguages={availableLanguages}
      />

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
            <SimpleCodeEditor
              value={editorState.code || roomState.room.code}
              language={roomState.room.language}
              onChange={handleCodeChange}
            />
          </div>

          {/* Execution Panel */}
          <div className="h-1/3 border-t border-gray-200 dark:border-gray-700">
            <ExecutionPanel
              result={editorState.lastExecution}
              isExecuting={editorState.isExecuting}
              onExecute={handleExecuteCode}
              disabled={!connectionState.connected}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-gray-50 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <ConnectionStatus />
              <Button
                onClick={handleLeaveRoom}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-300 hover:bg-red-50"
              >
                Leave Room
              </Button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <UserList
              users={roomState.users}
              currentUserId={roomState.currentUser?.userId || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeEditor;
