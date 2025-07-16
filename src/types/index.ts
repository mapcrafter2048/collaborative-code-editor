/**
 * Type definitions for the collaborative code editor
 */

export interface User {
  id: string;
  userId: string;
  username: string;
  isOnline: boolean;
  color: string;
  cursor?: CursorPosition;
  selection?: Selection;
}

export interface CursorPosition {
  lineNumber: number;
  column: number;
}

export interface Selection {
  startLineNumber: number;
  startColumn: number;
  endLineNumber: number;
  endColumn: number;
}

export interface UserCursor {
  userId: string;
  position: CursorPosition;
  selection?: Selection;
}

export interface Room {
  id: string;
  language: string;
  code: string;
  userCount: number;
  users: string[];
  cursors: Record<string, UserCursor>;
  lastActivity: string;
  createdAt: string;
}

export interface ExecutionResult {
  success: boolean;
  output: string;
  error: string;
  executionTime: number;
  language: string;
  roomId: string;
  userId?: string;
  timestamp?: string;
}

export interface Language {
  id: string;
  name: string;
  extension: string;
  requiresCompilation: boolean;
  monacoLanguage?: string;
}

export interface ConnectionState {
  connected: boolean;
  socketId?: string;
  error?: string;
}

export interface RoomState {
  room: Room | null;
  users: User[];
  currentUser: {
    userId: string;
    username: string;
  } | null;
  isJoining: boolean;
  error?: string;
}

export interface EditorState {
  code: string;
  language: string;
  cursors: Map<string, UserCursor>;
  isExecuting: boolean;
  lastExecution?: ExecutionResult;
}

// Socket.IO event types
export interface SocketEvents {
  // Client to Server
  'join-room': (data: { roomId: string; userId?: string; username?: string }) => void;
  'leave-room': () => void;
  'code-change': (data: { code: string; roomId: string }) => void;
  'cursor-move': (data: { position: CursorPosition; selection?: Selection; roomId: string }) => void;
  'language-change': (data: { language: string; roomId: string }) => void;
  'execute-code': (data: { roomId: string; timeout?: number }) => void;
  'get-room-state': () => void;

  // Server to Client
  'connected': (data: { socketId: string; timestamp: string; supportedLanguages: Language[] }) => void;
  'room-joined': (data: { success: boolean; roomId: string; userId: string; roomState: Room; message: string }) => void;
  'room-join-error': (data: { success: boolean; error: string }) => void;
  'user-joined': (data: { userId: string; username: string; userCount: number; timestamp: string }) => void;
  'user-left': (data: { userId: string; username: string; userCount: number; timestamp: string }) => void;
  'user-list-updated': (data: { users: User[]; userCount: number; timestamp: string }) => void;
  'code-changed': (data: { code: string; userId: string; timestamp: string }) => void;
  'cursor-moved': (data: { userId: string; position: CursorPosition; selection?: Selection; timestamp: string }) => void;
  'language-changed': (data: { language: string; code: string; userId: string; timestamp: string }) => void;
  'execution-started': (data: { userId: string; language: string; timestamp: string }) => void;
  'execution-result': (data: ExecutionResult) => void;
  'execution-error': (data: { message: string; error: string; userId: string; timestamp: string }) => void;
  'room-state': (data: Room & { timestamp: string }) => void;
  'error': (data: { message: string }) => void;
}

// API response types
export interface CreateRoomResponse {
  roomId: string;
  language: string;
  createdAt: string;
}

export interface RoomInfoResponse {
  roomId: string;
  language: string;
  userCount: number;
  createdAt: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
  rooms: number;
  activeUsers: number;
}

// Editor theme types
export type EditorTheme = 'vs-dark' | 'vs-light' | 'hc-black';

// Component prop types
export interface CodeEditorProps {
  value: string;
  language: string;
  onChange: (value: string) => void;
  onCursorChange?: (position: CursorPosition) => void;
  onSelectionChange?: (selection: Selection) => void;
  theme?: EditorTheme;
  readOnly?: boolean;
  users?: User[];
  currentUserId?: string;
}

export interface LanguageSelectorProps {
  currentLanguage: string;
  availableLanguages: Language[];
  onChange: (language: string) => void;
  disabled?: boolean;
}

export interface ExecutionPanelProps {
  result?: ExecutionResult;
  isExecuting: boolean;
  onExecute: () => void;
  disabled?: boolean;
}

export interface UserListProps {
  users: User[];
  currentUserId: string;
}

export interface RoomHeaderProps {
  roomId: string;
  userCount: number;
  language: string;
  onLanguageChange: (language: string) => void;
  availableLanguages: Language[];
}

// Utility types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
