@echo off
REM Build script for collaborative code editor Docker images (Windows)
echo 🐳 Building Docker images for collaborative code editor...

REM Change to the project root directory
cd /d "%~dp0\.."

REM Build C runner
echo 📦 Building C runner...
docker build -f runner/c-runner-v2.dockerfile -t c-runner:latest .

REM Build C++ runner
echo 📦 Building C++ runner...
docker build -f runner/cpp-runner-v2.dockerfile -t cpp-runner:latest .

REM Build Python runner
echo 📦 Building Python runner...
docker build -f runner/python-runner-v2.dockerfile -t python-runner:latest .

REM Build Go runner
echo 📦 Building Go runner...
docker build -f runner/go-runner-v2.dockerfile -t go-runner:latest .

REM Build Node.js runner
echo 📦 Building Node.js runner...
docker build -f runner/node-runner-v2.dockerfile -t node-runner:latest .

REM Build TypeScript runner
echo 📦 Building TypeScript runner...
docker build -f runner/typescript-runner-v2.dockerfile -t typescript-runner:latest .

REM Build Rust runner
echo 📦 Building Rust runner...
docker build -f runner/rust-runner-v2.dockerfile -t rust-runner:latest .

REM Build PHP runner
echo 📦 Building PHP runner...
docker build -f runner/php-runner-v2.dockerfile -t php-runner:latest .

REM Build Ruby runner
echo 📦 Building Ruby runner...
docker build -f runner/ruby-runner-v2.dockerfile -t ruby-runner:latest .

REM Build Java runner
echo 📦 Building Java runner...
docker build -f runner/java-runner-v2.dockerfile -t java-runner:latest .

echo ✅ All Docker images built successfully!
echo.
echo 🔍 Built images:
docker images | findstr /R "c-runner cpp-runner python-runner go-runner node-runner typescript-runner rust-runner php-runner ruby-runner java-runner"

echo.
echo 🚀 You can now start the collaborative code editor server!
