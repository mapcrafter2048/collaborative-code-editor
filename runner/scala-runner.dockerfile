# runner/scala-runner.dockerfile
FROM openjdk:17-slim

RUN apt-get update && \
    apt-get install -y scala && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Compile Code.scala -> outputs Code.class, etc.
# Run the main method in the 'Code' class (case-sensitive)
# Ensure classpath includes current dir '.'
CMD bash -c "scalac Code.scala && scala -cp . Code < input.txt"