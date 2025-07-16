# runner/python-runner.dockerfile
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# The container expects a file named code.py and an input file.
# It will run code.py with the input from input.txt (if any)
CMD bash -c "python code.py < input.txt"
