'use client';

import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const ConnectionTest: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev.slice(-9), `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    const socketInstance = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      timeout: 20000,
      autoConnect: true
    });

    addLog('Socket instance created');

    socketInstance.on('connect', () => {
      setConnected(true);
      setError(null);
      addLog(`Connected with ID: ${socketInstance.id}`);
    });

    socketInstance.on('disconnect', (reason) => {
      setConnected(false);
      addLog(`Disconnected: ${reason}`);
    });

    socketInstance.on('connect_error', (err) => {
      setError(err.message);
      setConnected(false);
      addLog(`Connection error: ${err.message}`);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const testConnection = () => {
    if (socket) {
      socket.disconnect();
      socket.connect();
      addLog('Manual reconnection triggered');
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">WebSocket Connection Test</h3>
      
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
          connected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${
            connected ? 'bg-green-500' : 'bg-red-500'
          }`} />
          {connected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
          <p className="text-red-800 text-sm">Error: {error}</p>
        </div>
      )}

      <button
        onClick={testConnection}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Reconnection
      </button>

      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded max-h-60 overflow-y-auto">
        <h4 className="font-medium mb-2">Connection Logs:</h4>
        {logs.map((log, index) => (
          <div key={index} className="text-sm text-gray-600 dark:text-gray-300 mb-1">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectionTest;
