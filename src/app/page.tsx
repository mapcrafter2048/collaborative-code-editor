'use client';

import React from 'react';
import CollaborativeEditor from '../components/CollaborativeEditor';
import ConnectionTest from '../components/ConnectionTest';

export default function Home() {
  // Get room ID from URL if provided
  const getRoomIdFromUrl = () => {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get('room') || undefined;
  };

  // Show connection test in debug mode
  const showDebug = typeof window !== 'undefined' && 
    new URLSearchParams(window.location.search).get('debug') === 'true';

  if (showDebug) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-8">Debug Mode</h1>
        <div className="grid grid-cols-1 gap-8">
          <ConnectionTest />
          <CollaborativeEditor 
            initialRoomId={getRoomIdFromUrl()}
            initialUsername="Developer"
          />
        </div>
      </main>
    );
  }

  return (
    <main>
      <CollaborativeEditor 
        initialRoomId={getRoomIdFromUrl()}
        initialUsername="Developer"
      />
    </main>
  );
}
