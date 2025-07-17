'use client';

import React, { useState, useRef } from 'react';
import YjsMonacoEditor from '@/components/YjsMonacoEditor';
import { Button } from '@/components/ui/button';
import { Select, SelectOption } from '@/components/ui/select';
import type { editor } from 'monaco-editor';

type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;

const LANGUAGES = [
  { id: 'javascript', name: 'JavaScript' },
  { id: 'typescript', name: 'TypeScript' },
  { id: 'python', name: 'Python' },
  { id: 'java', name: 'Java' },
  { id: 'cpp', name: 'C++' },
  { id: 'c', name: 'C' },
  { id: 'go', name: 'Go' },
  { id: 'rust', name: 'Rust' },
  { id: 'php', name: 'PHP' },
  { id: 'ruby', name: 'Ruby' },
];

const THEMES = [
  { id: 'vs-dark', name: 'Dark' },
  { id: 'vs-light', name: 'Light' },
  { id: 'hc-black', name: 'High Contrast' },
];

export default function YjsTestPage() {
  const [roomId, setRoomId] = useState('test-room-1');
  const [language, setLanguage] = useState('javascript');
  const [theme, setTheme] = useState<'vs-dark' | 'vs-light' | 'hc-black'>('vs-dark');
  const [username, setUsername] = useState(`User-${Math.floor(Math.random() * 1000)}`);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [executionResult, setExecutionResult] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);

  const handleEditorReady = (editor: IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const handleConnectionChange = (isConnected: boolean) => {
    setConnected(isConnected);
  };

  const handleUsersChange = (userList: any[]) => {
    setUsers(userList);
  };

  const executeCode = async () => {
    if (!editorRef.current) return;

    setIsExecuting(true);
    setExecutionResult('Executing...');

    try {
      const code = editorRef.current.getValue();
      
      // Simulate code execution (you can replace this with actual execution logic)
      setTimeout(() => {
        setExecutionResult(`Executed ${language} code:\\n${code}\\n\\nOutput: Hello, World!`);
        setIsExecuting(false);
      }, 2000);
    } catch (error) {
      setExecutionResult(`Error: ${error}`);
      setIsExecuting(false);
    }
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Y.js Monaco Editor Test
          </h1>
          <p className="text-gray-600">
            Test the collaborative Monaco Editor with Y.js integration
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room ID
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button onClick={copyRoomId} variant="outline" size="sm">
                  Copy
                </Button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <Select value={language} onChange={(e) => setLanguage(e.target.value)}>
                {LANGUAGES.map((lang) => (
                  <SelectOption key={lang.id} value={lang.id}>
                    {lang.name}
                  </SelectOption>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Theme
              </label>
              <Select value={theme} onChange={(e) => setTheme(e.target.value as 'vs-dark' | 'vs-light' | 'hc-black')}>
                {THEMES.map((t) => (
                  <SelectOption key={t.id} value={t.id}>
                    {t.name}
                  </SelectOption>
                ))}
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-sm text-gray-600">
                {connected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            
            <div className="text-sm text-gray-600">
              {users.length} active user{users.length !== 1 ? 's' : ''}
            </div>

            <Button 
              onClick={executeCode} 
              disabled={isExecuting || !connected}
              className="ml-auto"
            >
              {isExecuting ? 'Executing...' : 'Execute Code'}
            </Button>
          </div>
        </div>

        {/* Editor and Output */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Collaborative Editor
                </h2>
                <div className="flex items-center space-x-2">
                  {users.map((user, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: user.user?.color || '#666' }}
                      title={user.user?.name || 'Anonymous'}
                    >
                      {(user.user?.name || 'A')[0].toUpperCase()}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="h-96 border rounded-lg overflow-hidden">
                <YjsMonacoEditor
                  roomId={roomId}
                  language={language}
                  theme={theme}
                  username={username}
                  onReady={handleEditorReady}
                  onConnectionChange={handleConnectionChange}
                  onUsersChange={handleUsersChange}
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Active Users */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Users</h3>
              <div className="space-y-2">
                {users.length === 0 ? (
                  <p className="text-gray-500 text-sm">No active users</p>
                ) : (
                  users.map((user, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                        style={{ backgroundColor: user.user?.color || '#666' }}
                      >
                        {(user.user?.name || 'A')[0].toUpperCase()}
                      </div>
                      <span className="text-sm text-gray-700">
                        {user.user?.name || 'Anonymous'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Execution Output */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Output</h3>
              <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-sm min-h-32 overflow-auto">
                <pre className="whitespace-pre-wrap">
                  {executionResult || 'No output yet. Click "Execute Code" to run the current code.'}
                </pre>
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4 mt-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions</h3>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• Open this page in multiple tabs or browsers to test collaboration</li>
            <li>• Use the same Room ID to join the same collaborative session</li>
            <li>• Changes made by one user will be reflected in real-time for all users</li>
            <li>• You can see other users' cursors and selections in different colors</li>
            <li>• Try changing the language and theme to see how they affect the editor</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
