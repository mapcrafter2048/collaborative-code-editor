'use client';

import React, { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import type { 
  CodeEditorProps, 
  CursorPosition, 
  Selection, 
  User 
} from '@/types';

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="text-gray-600">Loading editor...</div>
    </div>
  ),
});

// Monaco types (will be available after dynamic import)
type Monaco = typeof import('monaco-editor');
type IStandaloneCodeEditor = import('monaco-editor').editor.IStandaloneCodeEditor;
type IModelDeltaDecoration = import('monaco-editor').editor.IModelDeltaDecoration;
type IStandaloneEditorConstructionOptions = import('monaco-editor').editor.IStandaloneEditorConstructionOptions;

const LANGUAGE_MAPPING = {
  cpp: 'cpp',
  python: 'python', 
  go: 'go',
  javascript: 'javascript'
} as const;

const DEFAULT_CODE = {
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
  go: `package main

import "fmt"

func main() {
    fmt.Println("Hello, World!")
}`,
  javascript: `function main() {
    console.log("Hello, World!");
}

main();`
};

const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onCursorChange,
  onSelectionChange,
  language = 'javascript',
  theme = 'vs-dark',
  users = [],
  currentUserId = ''
}) => {
  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);
  const [monaco, setMonaco] = useState<Monaco | null>(null);

  // Load Monaco dynamically when needed
  useEffect(() => {
    if (typeof window !== 'undefined' && !monaco) {
      import('monaco-editor').then((monacoModule) => {
        setMonaco(monacoModule);
      });
    }
  }, [monaco]);

  const handleEditorDidMount = (editor: IStandaloneCodeEditor, monacoInstance: Monaco) => {
    editorRef.current = editor;
    setMonaco(monacoInstance);
    setIsEditorReady(true);

    // Handle cursor position changes
    editor.onDidChangeCursorPosition((e) => {
      if (onCursorChange) {
        const position: CursorPosition = {
          lineNumber: e.position.lineNumber,
          column: e.position.column
        };
        onCursorChange(position);
      }
    });

    // Handle selection changes
    editor.onDidChangeCursorSelection((e) => {
      if (onSelectionChange && !e.selection.isEmpty()) {
        const selection: Selection = {
          startLineNumber: e.selection.startLineNumber,
          startColumn: e.selection.startColumn,
          endLineNumber: e.selection.endLineNumber,
          endColumn: e.selection.endColumn
        };
        onSelectionChange(selection);
      }
    });

    // Handle content changes
    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      if (onChange) {
        onChange(newValue);
      }
    });
  };

  // Update user cursors and selections
  useEffect(() => {
    if (!editorRef.current || !monaco || !isEditorReady) return;

    const editor = editorRef.current;
    const decorations: IModelDeltaDecoration[] = [];

    users.forEach((user: User) => {
      if (user.id === currentUserId) return;

      // Add cursor decoration
      if (user.cursor) {
        decorations.push({
          range: new monaco.Range(
            user.cursor.lineNumber,
            user.cursor.column,
            user.cursor.lineNumber,
            user.cursor.column
          ),
          options: {
            className: `user-cursor user-cursor-${user.color}`,
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
          }
        });
      }

      // Add selection decoration
      if (user.selection && (user.selection.startLineNumber !== user.selection.endLineNumber || 
          user.selection?.startColumn !== user.selection?.endColumn)) {
        decorations.push({
          range: new monaco.Range(
            user.selection.startLineNumber,
            user.selection.startColumn,
            user.selection.endLineNumber,
            user.selection.endColumn
          ),
          options: {
            className: `user-selection user-selection-${user.color}`,
            stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges
          }
        });
      }
    });

    editor.deltaDecorations([], decorations);
  }, [users, currentUserId, monaco, isEditorReady]);

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

  const getDefaultCodeForLanguage = (lang: string): string => {
    return DEFAULT_CODE[lang as keyof typeof DEFAULT_CODE] || DEFAULT_CODE.javascript;
  };

  const currentValue = value || getDefaultCodeForLanguage(language);

  return (
    <div className="w-full h-full border rounded-lg overflow-hidden">
      <MonacoEditor
        height="100%"
        language={LANGUAGE_MAPPING[language as keyof typeof LANGUAGE_MAPPING] || 'javascript'}
        value={currentValue}
        theme={theme}
        onMount={handleEditorDidMount}
        options={editorOptions}
        loading={
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600">Loading Monaco Editor...</div>
          </div>
        }
      />
    </div>
  );
};

export default CodeEditor;
