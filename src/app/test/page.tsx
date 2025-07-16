'use client';

import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function SimpleTest() {
  const [status, setStatus] = useState('Initializing...');
  const [socketId, setSocketId] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev.slice(-10), `${timestamp}: ${message}`]);
    console.log(`🔌 ${timestamp}: ${message}`);
  };

  useEffect(() => {
    addLog('Creating socket connection...');
    
    const socket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    socket.on('connect', () => {
      setStatus('Connected ✅');
      setSocketId(socket.id || '');
      addLog(`Connected successfully with ID: ${socket.id}`);
    });

    socket.on('disconnect', (reason) => {
      setStatus('Disconnected ❌');
      addLog(`Disconnected: ${reason}`);
    });

    socket.on('connect_error', (error) => {
      setStatus('Connection Error ❌');
      addLog(`Connection error: ${error.message}`);
    });

    socket.on('reconnect', (attemptNumber) => {
      addLog(`Reconnected after ${attemptNumber} attempts`);
    });

    socket.on('reconnect_error', (error) => {
      addLog(`Reconnection error: ${error.message}`);
    });

    socket.on('reconnect_failed', () => {
      addLog('Reconnection failed - giving up');
    });

    addLog('Socket event listeners attached');

    return () => {
      addLog('Cleaning up socket connection...');
      socket.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">WebSocket Connection Test</h1>
        
        <div className="mb-6">
          <div className="text-lg font-semibold mb-2">Status: <span className="text-blue-600">{status}</span></div>
          {socketId && <div className="text-sm text-gray-600">Socket ID: {socketId}</div>}
        </div>

        <div className="bg-gray-50 rounded p-4">
          <h3 className="font-semibold mb-3">Connection Logs:</h3>
          <div className="space-y-1 max-h-60 overflow-y-auto">
            {logs.length === 0 ? (
              <div className="text-gray-500 text-sm">No logs yet...</div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="text-sm font-mono text-gray-700">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• This page tests the WebSocket connection to the backend</li>
            <li>• Check the logs above for connection details</li>
            <li>• Open browser developer tools (F12) for more detailed logs</li>
            <li>• Backend should be running on port 3001</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
