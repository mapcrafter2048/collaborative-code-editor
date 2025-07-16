# runner/java-runner.dockerfile
FROM openjdk:11

# Set the working directory
WORKDIR /app

# The container expects a file named Code.java and an input file.
# It will compile Code.java and run the program, piping input from input.txt.
CMD bash -c "javac Code.java && java Code < input.txt"
