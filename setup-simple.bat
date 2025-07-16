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

REM Clean up old images (optional)
echo 🧹 Cleaning up old Docker images...
call cleanup-docker.bat >nul 2>&1

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

echo   ⚙️ Building C runner...
docker build -f runner/c-runner-v2.dockerfile -t c-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build C runner
    pause
    exit /b 1
)
echo   ✅ C runner built successfully

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

echo   📘 Building TypeScript runner...
docker build -f runner/typescript-runner-v2.dockerfile -t typescript-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build TypeScript runner
    pause
    exit /b 1
)
echo   ✅ TypeScript runner built successfully

echo   🦀 Building Rust runner...
docker build -f runner/rust-runner-v2.dockerfile -t rust-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Rust runner
    pause
    exit /b 1
)
echo   ✅ Rust runner built successfully

echo   🐘 Building PHP runner...
docker build -f runner/php-runner-v2.dockerfile -t php-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build PHP runner
    pause
    exit /b 1
)
echo   ✅ PHP runner built successfully

echo   💎 Building Ruby runner...
docker build -f runner/ruby-runner-v2.dockerfile -t ruby-runner:latest .
if %errorlevel% neq 0 (
    echo ❌ Failed to build Ruby runner
    pause
    exit /b 1
)
echo   ✅ Ruby runner built successfully

echo.
echo 🎉 All Docker images built successfully!
echo.
echo 📋 Built images:
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}" | findstr /R "runner"
echo.
echo 🚀 Next steps:
echo 1. Install dependencies:
echo    Frontend: npm install
echo    Backend:  cd server ^&^& npm install
echo.
echo 2. Start the application:
echo    Backend:  cd server ^&^& npm start
echo    Frontend: npm run dev  ^(in a new terminal^)
echo.
echo 3. Open your browser to: http://localhost:3000
echo.
echo 💡 To clean up Docker images: cleanup-docker.bat
echo 💡 To test individual languages, use the web interface

pause
