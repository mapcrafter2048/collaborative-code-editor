# runner/dart-runner.dockerfile
FROM dart:stable

WORKDIR /app

# Run the Dart script directly using the dart VM
CMD bash -c "dart code.dart < input.txt"