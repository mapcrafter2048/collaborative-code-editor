@echo off
REM Build script for collaborative code editor Docker images (Windows)
echo 🐳 Building Docker images for collaborative code editor...

REM Change to the project root directory
cd /d "%~dp0\.."

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

echo ✅ All Docker images built successfully!
echo.
echo 🔍 Built images:
docker images | findstr /R "cpp-runner python-runner go-runner node-runner"

echo.
echo 🚀 You can now start the collaborative code editor server!
