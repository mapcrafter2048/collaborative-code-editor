# runner/swift-runner.dockerfile
FROM swift:5.9

WORKDIR /app

# The container expects a file named code.swift and an input file.
# It will compile and run the Swift code, piping input from input.txt.
CMD sh -c "swiftc code.swift -o code && ./code < input.txt" 