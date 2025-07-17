'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';
import type { editor } from 'monaco-editor';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-gray-600">Loading editor...</div>
    </div>
  ),
});

// Monaco types
type Monaco = typeof import('monaco-editor');
type IStandaloneCodeEditor = editor.IStandaloneCodeEditor;
type IStandaloneEditorConstructionOptions = editor.IStandaloneEditorConstructionOptions;

interface YjsMonacoEditorProps {
  roomId: string;
  language: string;
  theme?: 'vs-dark' | 'vs-light' | 'hc-black';
  websocketUrl?: string;
  username?: string;
  userColor?: string;
  onReady?: (editor: IStandaloneCodeEditor) => void;
  onConnectionChange?: (connected: boolean) => void;
  onUsersChange?: (users: any[]) => void;
}

const LANGUAGE_MAPPING = {
  c: 'c',
  cpp: 'cpp',
  python: 'python',
  javascript: 'javascript',
  typescript: 'typescript',
  go: 'go',
  rust: 'rust',
  java: 'java',
  php: 'php',
  ruby: 'ruby'
} as const;

const DEFAULT_CODE = {
  c: `#include <stdio.h>

int main() {
    printf("Hello, World!\\n");
    return 0;
}`,
  cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`,
  python: `def main():
    print("Hello, World!")

if __name__ == "__main__":
    main()`,
  javascript: `function main() {
    console.log("Hello, World!");
}

main();`,
  typescript: `function main(): void {
    console.log("Hello, World!");
}

main();`,
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  rust: `fn main() {
    println!("Hello, World!");
}`,
  java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`,
  php: `<?php
echo "Hello, World!\\n";
?>`,
  ruby: `def main
    puts "Hello, World!"
end

main`
};

// Generate random colors for users
const generateUserColors = () => {
  const colors = [
    { color: '#30bced', light: '#30bced33' },
    { color: '#6eeb83', light: '#6eeb8333' },
    { color: '#ffbc42', light: '#ffbc4233' },
    { color: '#ecd444', light: '#ecd44433' },
    { color: '#ee6352', light: '#ee635233' },
    { color: '#9ac2c9', light: '#9ac2c933' },
    { color: '#8acb88', light: '#8acb8833' },
    { color: '#1be7ff', light: '#1be7ff33' }
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const YjsMonacoEditor: React.FC<YjsMonacoEditorProps> = ({
  roomId,
  language,
  theme = 'vs-dark',
  websocketUrl = 'ws://localhost:3334',
  username = 'Anonymous',
  userColor,
  onReady,
  onConnectionChange,
  onUsersChange
}) => {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const ydocRef = useRef<Y.Doc | null>(null);
  const providerRef = useRef<WebsocketProvider | null>(null);
  const bindingRef = useRef<MonacoBinding | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  const [users, setUsers] = useState<any[]>([]);

  // Initialize Y.js document and WebSocket provider
  useEffect(() => {
    if (!roomId) return;

    // Create Y.js document
    const ydoc = new Y.Doc();
    ydocRef.current = ydoc;

    // Create WebSocket provider
    const provider = new WebsocketProvider(websocketUrl, `room-${roomId}`, ydoc);
    providerRef.current = provider;

    // Generate or use provided user color
    const userColors = userColor ? { color: userColor, light: `${userColor}33` } : generateUserColors();

    // Set user information for awareness
    provider.awareness.setLocalStateField('user', {
      name: username,
      color: userColors.color,
      colorLight: userColors.light
    });

    // Handle connection status
    provider.on('status', (event: any) => {
      setConnectionStatus(event.status);
      if (onConnectionChange) {
        onConnectionChange(event.status === 'connected');
      }
    });

    // Handle awareness changes (user presence)
    provider.awareness.on('change', () => {
      const states = Array.from(provider.awareness.getStates().values());
      setUsers(states);
      if (onUsersChange) {
        onUsersChange(states);
      }
    });

    // Cleanup on unmount
    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
      }
      if (providerRef.current) {
        providerRef.current.destroy();
      }
      if (ydocRef.current) {
        ydocRef.current.destroy();
      }
    };
  }, [roomId, websocketUrl, username, userColor, onConnectionChange, onUsersChange]);

  // Handle Monaco editor mount
  const handleEditorDidMount = (editor: IStandaloneCodeEditor, monaco: Monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setIsEditorReady(true);

    if (onReady) {
      onReady(editor);
    }

    // Create Y.js binding when both editor and Y.js are ready
    if (ydocRef.current && providerRef.current) {
      const ytext = ydocRef.current.getText('monaco');
      
      // Set initial content if the document is empty
      if (ytext.length === 0) {
        const defaultCode = DEFAULT_CODE[language as keyof typeof DEFAULT_CODE] || DEFAULT_CODE.javascript;
        ytext.insert(0, defaultCode);
      }

      // Create Monaco binding
      const binding = new MonacoBinding(
        ytext,
        editor.getModel()!,
        new Set([editor]),
        providerRef.current.awareness
      );
      bindingRef.current = binding;
    }
  };

  // Editor options
  const editorOptions: IStandaloneEditorConstructionOptions = {
    automaticLayout: true,
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Monaco, Consolas, "Courier New", monospace',
    lineNumbers: 'on',
    roundedSelection: false,
    scrollBeyondLastLine: false,
    minimap: { enabled: true },
    wordWrap: 'on',
    tabSize: 2,
    insertSpaces: true,
    detectIndentation: false,
    folding: true,
    lineNumbersMinChars: 3,
    scrollbar: {
      verticalScrollbarSize: 17,
      horizontalScrollbarSize: 17,
    },
    overviewRulerBorder: false,
    hideCursorInOverviewRuler: true,
    renderLineHighlight: 'line',
    selectionHighlight: false,
    renderWhitespace: 'selection',
  };

  // Get Monaco language
  const monacoLanguage = LANGUAGE_MAPPING[language as keyof typeof LANGUAGE_MAPPING] || 'javascript';

  return (
    <div className="w-full h-full border rounded-lg overflow-hidden relative">
      {/* Connection Status Indicator */}
      <div className="absolute top-2 right-2 z-10 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          connectionStatus === 'connected' ? 'bg-green-500' : 
          connectionStatus === 'connecting' ? 'bg-yellow-500' : 
          'bg-red-500'
        }`} />
        <span className="text-xs text-gray-500">
          {connectionStatus === 'connected' ? 'Connected' : 
           connectionStatus === 'connecting' ? 'Connecting...' : 
           'Disconnected'}
        </span>
        {users.length > 0 && (
          <span className="text-xs text-gray-500">
            {users.length} user{users.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <MonacoEditor
        height="100%"
        language={monacoLanguage}
        theme={theme}
        onMount={handleEditorDidMount}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Loading Y.js Monaco Editor...</div>
          </div>
        }
      />

      {/* Add custom CSS for Y.js selections and cursors */}
      <style jsx global>{`
        .yRemoteSelection {
          background-color: rgba(250, 129, 0, 0.3);
        }
        .yRemoteSelectionHead {
          position: absolute;
          border-left: orange solid 2px;
          border-top: orange solid 2px;
          border-bottom: orange solid 2px;
          height: 100%;
          box-sizing: border-box;
        }
        .yRemoteSelectionHead::after {
          position: absolute;
          content: ' ';
          border: 3px solid orange;
          border-radius: 4px;
          left: -4px;
          top: -5px;
        }
      `}</style>
    </div>
  );
};

export default YjsMonacoEditor;
