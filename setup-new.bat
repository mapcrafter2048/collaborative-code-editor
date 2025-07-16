@echo off
REM Simple setup script for Collaborative Code Editor (Windows)
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

REM Clean up old images
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
echo   ✅ C++ runner built successfully

echo   🐍 Building Python runner...
docker build -f runner/python-runner-v2.dockerfile -t python-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Python runner
    pause
    exit /b 1
)
echo   ✅ Python runner built successfully

echo   🐹 Building Go runner...
docker build -f runner/go-runner-v2.dockerfile -t go-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Go runner
    pause
    exit /b 1
)
echo   ✅ Go runner built successfully

echo   📦 Building Node.js runner...
docker build -f runner/node-runner-v2.dockerfile -t node-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Node.js runner
    pause
    exit /b 1
)
echo   ✅ Node.js runner built successfully

echo.
echo 🎉 All Docker images built successfully!
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
echo.
echo 🧪 To test the Docker images manually, run:
echo    docker run --rm --tmpfs /app:size=100m --workdir /app cpp-runner:latest sh -c "echo 'int main(){return 0;}' > code.cpp && g++ code.cpp -o code.out && echo 'Test passed'"

pause
