# runner/rust-runner.dockerfile
FROM rust:1.67-slim

WORKDIR /app

# The container expects a file named code.rs and an input file.
# It compiles code.rs to an executable and then runs it, piping input from input.txt.
CMD bash -c "rustc code.rs -o code.out && ./code.out < input.txt"
