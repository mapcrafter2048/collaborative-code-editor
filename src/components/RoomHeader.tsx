'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import LanguageSelector from './LanguageSelector';
import type { RoomHeaderProps } from '../types';

/**
 * RoomHeader component displaying room information and controls
 * Features:
 * - Room ID display with copy functionality
 * - User count indicator
 * - Language selector
 * - Room sharing features
 * - Responsive design
 */
const RoomHeader: React.FC<RoomHeaderProps> = ({
  roomId,
  userCount,
  language,
  onLanguageChange,
  availableLanguages
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy room ID:', err);
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = roomId;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareRoom = async () => {
    const roomUrl = `${window.location.origin}${window.location.pathname}?room=${roomId}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my coding session',
          text: `Join me in this collaborative coding session using room ID: ${roomId}`,
          url: roomUrl
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(roomUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy room URL:', err);
      }
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Room info */}
        <div className="flex items-center space-x-6">
          {/* Room ID */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                🏠 Room
              </span>
              <code className="bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-md text-sm font-mono text-gray-800 dark:text-gray-200">
                {roomId}
              </code>
              <Button
                onClick={copyRoomId}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                title="Copy room ID"
              >
                {copied ? '✅' : '📋'}
              </Button>
            </div>
          </div>

          {/* User count */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <span>👥</span>
            <span>
              {userCount} {userCount === 1 ? 'user' : 'users'}
            </span>
          </div>

          {/* Connection status */}
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-green-600 dark:text-green-400">
              Connected
            </span>
          </div>
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center space-x-4">
          {/* Language selector */}
          <LanguageSelector
            currentLanguage={language}
            availableLanguages={availableLanguages}
            onChange={onLanguageChange}
          />

          {/* Share button */}
          <Button
            onClick={shareRoom}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <span>🔗</span>
            <span>Share</span>
          </Button>
        </div>
      </div>

      {/* Room URL display (mobile friendly) */}
      <div className="mt-3 lg:hidden">
        <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
          <span>Share this room:</span>
          <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs break-all">
            {`${window.location.origin}?room=${roomId}`}
          </code>
        </div>
      </div>

      {/* Success message */}
      {copied && (
        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md">
          <span className="text-sm text-green-700 dark:text-green-300">
            ✅ Copied to clipboard!
          </span>
        </div>
      )}
    </div>
  );
};

export default RoomHeader;
