@echo off
REM Comprehensive setup script for Collaborative Code Editor (Windows)
echo 🚀 Setting up Collaborative Code Editor...

REM Check if Docker is installed and running
echo 🔍 Checking Docker installation...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    echo    Visit: https://docs.docker.com/desktop/windows/
    pause
    exit /b 1
)

docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

echo ✅ Docker is available and running

REM Clean up old images (optional)
echo 🧹 Cleaning up old Docker images...
docker rmi cpp-runner:latest python-runner:latest go-runner:latest node-runner:latest >nul 2>&1

REM Build Docker images
echo 📦 Building Docker images...

echo   🔧 Building C++ runner...
docker build -f runner/cpp-runner-v2.dockerfile -t cpp-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build C++ runner
    pause
    exit /b 1
)

echo   🐍 Building Python runner...
docker build -f runner/python-runner-v2.dockerfile -t python-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Python runner
    pause
    exit /b 1
)

echo   🐹 Building Go runner...
docker build -f runner/go-runner-v2.dockerfile -t go-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Go runner
    pause
    exit /b 1
)

echo   📦 Building Node.js runner...
docker build -f runner/node-runner-v2.dockerfile -t node-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Node.js runner
    pause
    exit /b 1
)

echo ✅ All Docker images built successfully!

REM Test Docker images
echo 🧪 Testing Docker images...

echo   Testing C++ runner...
echo int main(){return 0;} > %temp%\test.cpp
docker run --rm -v %temp%:/host:ro --tmpfs /app:size=100m --workdir /app cpp-runner:latest sh -c "cp /host/test.cpp /app/code.cpp && g++ code.cpp -o code.out && ./code.out" && echo   ✅ C++ runner works

echo   Testing Python runner...
echo print("Hello, World!") > %temp%\test.py
docker run --rm -v %temp%:/host:ro --tmpfs /app:size=100m --workdir /app python-runner:latest sh -c "cp /host/test.py /app/code.py && python code.py" && echo   ✅ Python runner works

echo   Testing Go runner...
echo package main; import "fmt"; func main(){fmt.Println("Hello, World!")} > %temp%\test.go
docker run --rm -v %temp%:/host:ro --tmpfs /app:size=100m --workdir /app go-runner:latest sh -c "cp /host/test.go /app/code.go && go run code.go" && echo   ✅ Go runner works

echo   Testing Node.js runner...
echo console.log("Hello, World!") > %temp%\test.js
docker run --rm -v %temp%:/host:ro --tmpfs /app:size=100m --workdir /app node-runner:latest sh -c "cp /host/test.js /app/code.js && node code.js" && echo   ✅ Node.js runner works

REM Clean up test files
del %temp%\test.cpp %temp%\test.py %temp%\test.go %temp%\test.js >nul 2>&1

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Built images:
docker images | findstr /R "cpp-runner python-runner go-runner node-runner"
echo.
echo 🚀 Next steps:
echo 1. Install dependencies:
echo    Frontend: npm install
echo    Backend:  cd server ^&^& npm install
echo.
echo 2. Start the application:
echo    Backend:  cd server ^&^& npm start
echo    Frontend: npm run dev
echo.
echo 3. Open your browser to: http://localhost:3000

pause
