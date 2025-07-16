# runner/haskell-runner.dockerfile
FROM haskell:latest

WORKDIR /app

# Compile the Haskell code using GHC and then run the executable
CMD bash -c "ghc Main.hs -o main.out && ./main.out < input.txt"