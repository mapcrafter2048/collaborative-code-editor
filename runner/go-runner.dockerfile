# runner/go-runner.dockerfile
FROM golang:1.18-alpine

WORKDIR /app

# Use sh instead of bash, since alpine doesn't include bash by default.
CMD sh -c "go run code.go < input.txt"
