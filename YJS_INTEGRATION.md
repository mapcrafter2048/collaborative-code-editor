# Y.js Integration - Alternative Collaborative Approach

This document describes the Y.js integration as an alternative collaborative editing approach for the code editor.

## Overview

Y.js is a high-performance CRDT (Conflict-free Replicated Data Type) library that provides real-time collaborative editing capabilities. This integration offers several advantages over the existing Socket.IO approach:

### Benefits of Y.js Integration

1. **Better Conflict Resolution**: Y.js uses CRDTs to handle concurrent edits automatically
2. **Higher Performance**: More efficient synchronization algorithm
3. **Offline Support**: Built-in support for offline editing and synchronization
4. **Rich Ecosystem**: Extensive ecosystem of providers and editor bindings
5. **User Awareness**: Built-in user presence and cursor tracking

## Architecture

### Components

1. **YjsMonacoEditor.tsx** - React component that wraps Monaco Editor with Y.js
2. **yjs-server.js** - WebSocket server for Y.js document synchronization
3. **Y.js Test Page** - Demo page at `/yjs-test` for testing the integration

### Data Flow

```
Client 1 (Monaco Editor) ←→ Y.js Document ←→ WebSocket Server ←→ Y.js Document ←→ Client 2 (Monaco Editor)
```

## Implementation Details

### Client Side (YjsMonacoEditor.tsx)

```typescript
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { MonacoBinding } from 'y-monaco';

// Create Y.js document
const ydoc = new Y.Doc();

// Create WebSocket provider
const provider = new WebsocketProvider(websocketUrl, `room-${roomId}`, ydoc);

// Bind Y.js document to Monaco Editor
const ytext = ydoc.getText('monaco');
const binding = new MonacoBinding(ytext, editor.getModel(), new Set([editor]), provider.awareness);
```

### Server Side (yjs-server.js)

```javascript
const WebSocket = require('ws');
const { setupWSConnection } = require('y-websocket/bin/utils.js');

const wss = new WebSocket.Server({ port: 3334 });

wss.on('connection', (ws, req) => {
  setupWSConnection(ws, req, { docName: req.url.slice(1) });
});
```

## Features

### Real-time Collaboration
- Multiple users can edit the same document simultaneously
- Changes are synchronized in real-time across all clients
- Automatic conflict resolution using CRDTs

### User Awareness
- See other users' cursors and selections
- Color-coded user identification
- Real-time user presence indicators

### Connection Management
- Connection status indicator
- Automatic reconnection on connection loss
- Graceful handling of network issues

## Usage

### Starting the Servers

1. Start the Y.js WebSocket server (runs on port 3334):
```bash
cd server
npm start
```

2. Start the Next.js development server:
```bash
npm run dev
```

### Testing the Integration

Visit `/yjs-test` to test the Y.js Monaco Editor:

1. Open the page in multiple browser tabs
2. Use the same Room ID to join the same session
3. Start typing to see real-time collaboration
4. Observe user cursors and selections

### Component Usage

```tsx
import YjsMonacoEditor from '@/components/YjsMonacoEditor';

<YjsMonacoEditor
  roomId="test-room"
  language="javascript"
  theme="vs-dark"
  username="User123"
  onReady={(editor) => console.log('Editor ready')}
  onConnectionChange={(connected) => console.log('Connection:', connected)}
  onUsersChange={(users) => console.log('Users:', users)}
/>
```

## Configuration

### WebSocket Server Configuration

The Y.js WebSocket server can be configured in `server/yjs-server.js`:

```javascript
const server = new YjsWebSocketServer({
  port: 3334,
  host: 'localhost',
  gc: true // Enable garbage collection
});
```

### Client Configuration

```typescript
const YjsMonacoEditor: React.FC<YjsMonacoEditorProps> = ({
  roomId,
  language,
  theme = 'vs-dark',
  websocketUrl = 'ws://localhost:3334', // WebSocket server URL
  username = 'Anonymous',
  userColor, // Optional custom user color
  onReady,
  onConnectionChange,
  onUsersChange
}) => {
  // Component implementation
};
```

## Comparison with Socket.IO Approach

| Feature | Y.js | Socket.IO |
|---------|------|-----------|
| Conflict Resolution | Automatic (CRDT) | Manual implementation |
| Performance | High | Medium |
| Offline Support | Built-in | Requires custom implementation |
| User Awareness | Built-in | Manual implementation |
| Complexity | Low | Medium |
| Scalability | High | Medium |

## Dependencies

### Client Dependencies
- `yjs` - Core Y.js library
- `y-websocket` - WebSocket provider for Y.js
- `y-monaco` - Monaco Editor binding for Y.js

### Server Dependencies
- `y-websocket` - WebSocket server for Y.js
- `ws` - WebSocket library

## Future Enhancements

1. **Persistence**: Add database persistence for documents
2. **Authentication**: Integrate user authentication
3. **Permissions**: Add document-level permissions
4. **Version History**: Implement document versioning
5. **Offline Sync**: Enhanced offline synchronization

## Testing

The integration includes comprehensive testing through the `/yjs-test` page:

1. **Multi-user Testing**: Open multiple browser tabs
2. **Connection Testing**: Test reconnection scenarios
3. **Language Testing**: Test with different programming languages
4. **Theme Testing**: Test with different editor themes

## Troubleshooting

### Common Issues

1. **Connection Failed**: Check if Y.js WebSocket server is running on port 3334
2. **Document Not Syncing**: Verify all clients are using the same room ID
3. **User Colors Not Showing**: Check if user awareness is properly configured

### Debug Mode

Enable debug mode by adding to the component:

```typescript
// Enable Y.js debug mode
import { setDebugMode } from 'yjs';
setDebugMode(true);
```

## Resources

- [Y.js Documentation](https://docs.yjs.dev/)
- [Monaco Editor Y.js Binding](https://github.com/yjs/y-monaco)
- [Y.js WebSocket Provider](https://github.com/yjs/y-websocket)
- [Y.js Demos](https://github.com/yjs/yjs-demos)

## Contributing

When contributing to the Y.js integration:

1. Test with multiple users
2. Verify offline/online scenarios
3. Check different programming languages
4. Ensure proper cleanup of resources
5. Document any new features or changes
