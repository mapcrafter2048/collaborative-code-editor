'use client';

import React from 'react';
import type { UserListProps } from '../types';

/**
 * UserList component displaying active users in the room
 * Features:
 * - Real-time user presence
 * - User avatars with colors
 * - Online/offline status
 * - Current user highlighting
 * - Responsive design
 */
const UserList: React.FC<UserListProps> = ({ users, currentUserId }) => {
  // Generate consistent colors for users
  const getUserColor = (userId: string): string => {
    const colors = [
      'bg-red-500',
      'bg-blue-500', 
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500'
    ];
    const index = userId.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const getInitials = (username: string): string => {
    return username
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (users.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Users ({users.length})
        </h3>
        <div className="text-center py-4">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            No users in this room
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Users ({users.length})
      </h3>
      
      <div className="space-y-2">
        {users.map((user) => (
          <div
            key={user.userId}
            className={`flex items-center space-x-3 p-2 rounded-md transition-colors ${
              user.userId === currentUserId
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            {/* Avatar */}
            <div className="relative">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium ${getUserColor(
                  user.userId
                )}`}
              >
                {getInitials(user.username)}
              </div>
              
              {/* Online status indicator */}
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`}
                title={user.isOnline ? 'Online' : 'Offline'}
              />
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <span
                  className={`text-sm font-medium truncate ${
                    user.userId === currentUserId
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {user.username}
                  {user.userId === currentUserId && (
                    <span className="ml-1 text-xs text-blue-600 dark:text-blue-400">
                      (you)
                    </span>
                  )}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                <span className={`inline-block w-2 h-2 rounded-full ${
                  user.isOnline ? 'bg-green-500' : 'bg-gray-400'
                }`} />
                <span>{user.isOnline ? 'Online' : 'Offline'}</span>
              </div>
            </div>

            {/* Actions (future expansion) */}
            <div className="flex items-center space-x-1">
              {user.userId === currentUserId && (
                <span className="text-xs text-blue-600 dark:text-blue-400">👑</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Quick stats */}
      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>
            {users.filter(u => u.isOnline).length} online
          </span>
          <span>
            {users.length} total
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserList;
