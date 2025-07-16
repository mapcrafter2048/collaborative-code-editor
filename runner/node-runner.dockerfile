# runner/node-runner.dockerfile
FROM node:18-slim

WORKDIR /app

# Run the JavaScript file; input.txt is piped into the Node.js process.
CMD sh -c "node code.js < input.txt"
