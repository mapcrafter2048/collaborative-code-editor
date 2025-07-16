# runner/groovy-runner.dockerfile
# Use the official Groovy image (includes JVM)
FROM groovy:latest

WORKDIR /app

# Run the Groovy script using the groovy interpreter, piping input from input.txt.
CMD groovy code.groovy < input.txt