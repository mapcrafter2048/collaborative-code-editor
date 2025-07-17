#!/bin/bash

# Test script for all language runners
echo "🧪 Testing all language runners..."

# Change to the project root directory
cd "$(dirname "$0")/.."

echo ""
echo "📋 Testing C runner..."
echo '#include <stdio.h>' > test.c
echo 'int main() { printf("C works!\n"); return 0; }' >> test.c
docker run --rm -v "$(pwd):/host:ro" --workdir /app c-runner:latest sh -c "cp /host/test.c /app/ && gcc test.c -o test.out && ./test.out"
rm test.c

echo ""
echo "📋 Testing C++ runner..."
echo '#include <iostream>' > test.cpp
echo 'using namespace std;' >> test.cpp
echo 'int main() { cout << "C++ works!" << endl; return 0; }' >> test.cpp
docker run --rm -v "$(pwd):/host:ro" --workdir /app cpp-runner:latest sh -c "cp /host/test.cpp /app/ && g++ test.cpp -o test.out && ./test.out"
rm test.cpp

echo ""
echo "📋 Testing Python runner..."
echo 'print("Python works!")' > test.py
docker run --rm -v "$(pwd):/host:ro" --workdir /app python-runner:latest sh -c "cp /host/test.py /app/ && python test.py"
rm test.py

echo ""
echo "📋 Testing JavaScript runner..."
echo 'console.log("JavaScript works!");' > test.js
docker run --rm -v "$(pwd):/host:ro" --workdir /app node-runner:latest sh -c "cp /host/test.js /app/ && node test.js"
rm test.js

echo ""
echo "📋 Testing TypeScript runner..."
echo 'console.log("TypeScript works!");' > test.ts
docker run --rm -v "$(pwd):/host:ro" --workdir /app typescript-runner:latest sh -c "cp /host/test.ts /app/ && ts-node test.ts"
rm test.ts

echo ""
echo "📋 Testing Go runner..."
echo 'package main' > test.go
echo 'import "fmt"' >> test.go
echo 'func main() { fmt.Println("Go works!") }' >> test.go
docker run --rm -v "$(pwd):/host:ro" --workdir /app go-runner:latest sh -c "cp /host/test.go /app/ && go mod init temp && go run test.go"
rm test.go

echo ""
echo "📋 Testing Java runner..."
cat > test.java << 'EOF'
public class test {
    public static void main(String[] args) {
        System.out.println("Java works!");
    }
}
EOF
docker run --rm -v "$(pwd):/host:ro" --workdir /app java-runner:latest sh -c "cp /host/test.java /app/ && javac test.java && java test"
rm test.java

echo ""
echo "📋 Testing PHP runner..."
echo '<?php echo "PHP works!\n"; ?>' > test.php
docker run --rm -v "$(pwd):/host:ro" --workdir /app php-runner:latest sh -c "cp /host/test.php /app/ && php test.php"
rm test.php

echo ""
echo "📋 Testing Ruby runner..."
echo 'puts "Ruby works!"' > test.rb
docker run --rm -v "$(pwd):/host:ro" --workdir /app ruby-runner:latest sh -c "cp /host/test.rb /app/ && ruby test.rb"
rm test.rb

echo ""
echo "📋 Testing Rust runner..."
cat > test.rs << 'EOF'
fn main() {
    println!("Rust works!");
}
EOF
docker run --rm -v "$(pwd):/host:ro" --workdir /app rust-runner:latest sh -c "cp /host/test.rs /app/src/main.rs && cargo run"
rm test.rs

echo ""
echo "✅ All language tests completed!"
echo "🎉 Your collaborative code editor now supports 10 programming languages!"
