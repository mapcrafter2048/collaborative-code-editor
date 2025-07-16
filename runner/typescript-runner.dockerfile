# runner/typescript-runner.dockerfile
FROM node:18

WORKDIR /app

# Install TypeScript globally
RUN npm install -g typescript

# The container expects a file named code.ts and an input file.
# It will compile code.ts to JavaScript and run it, piping input from input.txt.
CMD sh -c "tsc code.ts && node code.js < input.txt" 