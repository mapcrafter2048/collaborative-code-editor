import { useState, useEffect, useCallback, useRef } from 'react';
import socketService from '../services/socketService';
import type { 
  EditorState, 
  ExecutionResult, 
  CursorPosition, 
  Selection, 
  UserCursor 
} from '../types';

/**
 * Custom hook for managing code editor state and operations
 * Features:
 * - Real-time code synchronization
 * - Code execution management
 * - Cursor position tracking
 * - Language switching
 * - Collaborative editing
 */
export function useCodeEditor(roomId: string | null) {
  const [editorState, setEditorState] = useState<EditorState>({
    code: '',
    language: 'javascript',
    cursors: new Map(),
    isExecuting: false
  });

  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const lastCodeChange = useRef<string>('');
  const isLocalChange = useRef<boolean>(false);

  const updateCode = useCallback((newCode: string) => {
    if (!roomId) return;

    // Prevent infinite loops by tracking local changes
    if (isLocalChange.current) {
      isLocalChange.current = false;
      return;
    }

    setEditorState(prev => ({ ...prev, code: newCode }));
    lastCodeChange.current = newCode;

    // Debounce code changes to avoid too many socket emissions
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      socketService.sendCodeChange(newCode, roomId);
    }, 300);
  }, [roomId]);

  const updateCursor = useCallback((position: CursorPosition, selection?: Selection) => {
    if (!roomId) return;

    // Throttle cursor updates
    socketService.sendCursorMove(position, selection, roomId);
  }, [roomId]);

  const changeLanguage = useCallback((newLanguage: string) => {
    if (!roomId) return;

    try {
      socketService.changeLanguage(newLanguage, roomId);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  }, [roomId]);

  const executeCode = useCallback(async (timeout?: number) => {
    if (!roomId) return;

    try {
      setEditorState(prev => ({ ...prev, isExecuting: true }));
      const languageAwareTimeout =
        timeout ?? (editorState.language === 'typescript' ? 300_000 : undefined);
      socketService.executeCode(roomId, languageAwareTimeout);
    } catch (error) {
      console.error('Failed to execute code:', error);
      setEditorState(prev => ({ 
        ...prev, 
        isExecuting: false,
        lastExecution: {
          success: false,
          output: '',
          error: error instanceof Error ? error.message : 'Execution failed',
          executionTime: 0,
          language: prev.language,
          roomId: roomId
        }
      }));
    }
  }, [roomId]);

  // Set up event listeners
  useEffect(() => {
    const unsubscribeCodeChanged = socketService.on('code-changed', (data: any) => {
      console.log('📝 Code changed by another user:', data.userId);
      
      // Mark as remote change to prevent echo
      isLocalChange.current = true;
      
      setEditorState(prev => ({ 
        ...prev, 
        code: data.code 
      }));
    });

    const unsubscribeCursorMoved = socketService.on('cursor-moved', (data: any) => {
      setEditorState(prev => {
        const newCursors = new Map(prev.cursors);
        newCursors.set(data.userId, {
          userId: data.userId,
          position: data.position,
          selection: data.selection
        });
        
        return { 
          ...prev, 
          cursors: newCursors 
        };
      });
    });

    const unsubscribeLanguageChanged = socketService.on('language-changed', (data: any) => {
      console.log('🔄 Language changed:', data.language);
      
      setEditorState(prev => ({
        ...prev,
        language: data.language,
        code: data.code
      }));
    });

    const unsubscribeExecutionStarted = socketService.on('execution-started', (data: any) => {
      console.log('🚀 Code execution started by:', data.userId);
      
      setEditorState(prev => ({ 
        ...prev, 
        isExecuting: true 
      }));
    });

    const unsubscribeExecutionResult = socketService.on('execution-result', (data: ExecutionResult) => {
      console.log('✅ Code execution completed:', data);
      
      setEditorState(prev => ({
        ...prev,
        isExecuting: false,
        lastExecution: data
      }));
    });

    const unsubscribeExecutionError = socketService.on('execution-error', (data: any) => {
      console.error('❌ Code execution error:', data);
      
      setEditorState(prev => ({
        ...prev,
        isExecuting: false,
        lastExecution: {
          success: false,
          output: '',
          error: data.error || data.message,
          executionTime: 0,
          language: prev.language,
          roomId: roomId || ''
        }
      }));
    });

    const unsubscribeUserLeft = socketService.on('user-left', (data: any) => {
      // Remove cursor for user who left
      setEditorState(prev => {
        const newCursors = new Map(prev.cursors);
        newCursors.delete(data.userId);
        
        return {
          ...prev,
          cursors: newCursors
        };
      });
    });

    return () => {
      unsubscribeCodeChanged();
      unsubscribeCursorMoved();
      unsubscribeLanguageChanged();
      unsubscribeExecutionStarted();
      unsubscribeExecutionResult();
      unsubscribeExecutionError();
      unsubscribeUserLeft();
    };
  }, [roomId]);

  // Update editor state when room changes
  useEffect(() => {
    if (!roomId) {
      // Reset state when leaving room
      setEditorState({
        code: '',
        language: 'javascript',
        cursors: new Map(),
        isExecuting: false
      });
    }
  }, [roomId]);

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  return {
    editorState,
    updateCode,
    updateCursor,
    changeLanguage,
    executeCode,
    isExecuting: editorState.isExecuting,
    lastExecution: editorState.lastExecution
  };
}
