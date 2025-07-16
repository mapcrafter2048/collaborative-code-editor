# runner/php-runner.dockerfile
FROM php:8.1-cli

WORKDIR /app

# Run the PHP script with input from input.txt.
CMD sh -c "php code.php < input.txt"
