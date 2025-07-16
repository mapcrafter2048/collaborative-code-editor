# runner/perl-runner.dockerfile
FROM perl:latest

WORKDIR /app

# Use bash -c explicitly and redirect from the mounted input file path
CMD bash -c "perl code.pl < /app/input.txt"