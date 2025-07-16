'use client';

import React from 'react';
import type { LanguageSelectorProps } from '../types';

/**
 * LanguageSelector component for switching programming languages
 * Features:
 * - Dropdown selection of supported languages
 * - Visual language indicators
 * - Disabled state support
 * - Clean UI with proper HTML semantics
 */
const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  availableLanguages,
  onChange,
  disabled = false
}) => {
  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value;
    if (newLanguage && newLanguage !== currentLanguage) {
      onChange(newLanguage);
    }
  };

  // Get language display info
  const getLanguageIcon = (languageId: string): string => {
    const icons: Record<string, string> = {
      'cpp': '🔧',
      'python': '🐍',
      'javascript': '📜'
    };
    return icons[languageId] || '📄';
  };

  const currentLangInfo = availableLanguages.find(lang => lang.id === currentLanguage);

  return (
    <div className="flex items-center space-x-2">
      <label htmlFor="language-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Language:
      </label>
      <div className="relative">
        <select
          id="language-select"
          value={currentLanguage}
          onChange={handleLanguageChange}
          disabled={disabled}
          className="min-w-[140px] appearance-none bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {availableLanguages.map((language) => (
            <option key={language.id} value={language.id}>
              {getLanguageIcon(language.id)} {language.name}
              {language.requiresCompilation ? ' (compiled)' : ''}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
      
      {/* Language info display */}
      {currentLangInfo && (
        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
          <span>{getLanguageIcon(currentLangInfo.id)}</span>
          <span>{currentLangInfo.name}</span>
          {currentLangInfo.extension && (
            <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
              {currentLangInfo.extension}
            </span>
          )}
          {currentLangInfo.requiresCompilation && (
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded text-xs">
              Compiled
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
