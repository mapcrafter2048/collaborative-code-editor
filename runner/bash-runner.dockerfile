# runner/bash-runner.dockerfile (Ubuntu variant)
FROM ubuntu:latest

WORKDIR /app

CMD bash code.sh < input.txt