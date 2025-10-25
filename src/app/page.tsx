'use client';

import React from 'react';
import CollaborativeEditor from '../components/CollaborativeEditor';

export default function Home() {
  // Get room ID from URL if provided
  const getRoomIdFromUrl = () => {
    if (typeof window === 'undefined') return undefined;
    const params = new URLSearchParams(window.location.search);
    return params.get('room') ?? undefined;
  };

  return (
    <main>
      <CollaborativeEditor 
        initialRoomId={getRoomIdFromUrl()}
        initialUsername="Developer"
      />
    </main>
  );
}
