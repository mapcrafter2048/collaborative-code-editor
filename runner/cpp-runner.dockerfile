# runner/cpp-runner.dockerfile
FROM ubuntu:20.04

# Install build essentials
RUN apt-get update && apt-get install -y g++ && rm -rf /var/lib/apt/lists/*

# Set the working directory inside the container
WORKDIR /app

# When the container starts, compile the code.
# If input.txt exists and is non-empty, pipe it into the executable.
CMD bash -c "g++ code.cpp -o code.out && (if [ -s input.txt ]; then cat input.txt | ./code.out; else ./code.out; fi)"
