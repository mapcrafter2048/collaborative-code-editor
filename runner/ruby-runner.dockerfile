# runner/ruby-runner.dockerfile
FROM ruby:3.1-slim

WORKDIR /app

# Execute Ruby code; if input.txt exists and is non-empty, it will be piped to the program.
CMD sh -c "ruby code.rb < input.txt"
