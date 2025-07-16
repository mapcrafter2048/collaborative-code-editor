FROM gcc:latest

WORKDIR /app

CMD bash -c "gcc code.c -o code.out && (if [ -s input.txt ]; then cat input.txt | ./code.out; else ./code.out; fi)"