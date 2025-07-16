'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full">Loading...</div>
});

export default function SimpleCodeEditor({ value, onChange, language }) {
  return (
    <div className="w-full h-full border rounded-lg overflow-hidden">
      <MonacoEditor
        height="100%"
        language={language || 'javascript'}
        value={value}
        theme="vs-dark"
        onChange={onChange}
        options={{
          automaticLayout: true,
          fontSize: 14,
          lineNumbers: 'on',
          minimap: { enabled: true },
          wordWrap: 'on',
          tabSize: 2
        }}
      />
    </div>
  );
}
