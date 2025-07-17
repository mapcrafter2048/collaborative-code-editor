const { setupWSConnection } = require('@y/websocket-server/utils');
const http = require('http');
const WebSocket = require('ws');

/**
 * Y.js WebSocket server for collaborative editing
 * This server handles Y.js document synchronization
 */
class YjsWebSocketServer {
  constructor(port = 3334) {
    this.port = port;
    this.server = null;
    this.wss = null;
  }

  /**
   * Start the Y.js WebSocket server
   */
  start() {
    console.log(`🌐 Starting Y.js WebSocket server on port ${this.port}`);
    
    // Create HTTP server
    this.server = http.createServer();
    
    // Create WebSocket server
    this.wss = new WebSocket.Server({ server: this.server });

    // Handle WebSocket connections
    this.wss.on('connection', (ws, req) => {
      console.log('🔗 New Y.js WebSocket connection established');
      
      // Setup Y.js connection
      setupWSConnection(ws, req, {
        docName: req.url.slice(1), // Use URL path as document name
        gc: true // Enable garbage collection
      });
      
      ws.on('close', () => {
        console.log('🔌 Y.js WebSocket connection closed');
      });
    });

    // Start server
    this.server.listen(this.port, () => {
      console.log(`📝 Y.js WebSocket server running on ws://localhost:${this.port}`);
      console.log(`📈 Document synchronization ready`);
    });
  }

  /**
   * Stop the server
   */
  stop() {
    if (this.wss) {
      this.wss.close();
    }
    if (this.server) {
      this.server.close();
    }
    console.log('🛑 Y.js WebSocket server stopped');
  }
}

// Start Y.js server if this file is run directly
if (require.main === module) {
  const yjsServer = new YjsWebSocketServer(3334);
  yjsServer.start();

  // Handle graceful shutdown
  process.on('SIGTERM', () => yjsServer.stop());
  process.on('SIGINT', () => yjsServer.stop());
}

module.exports = YjsWebSocketServer;
