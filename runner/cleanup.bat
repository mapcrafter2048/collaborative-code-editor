@echo off
REM Docker cleanup script for Collaborative Code Editor (Windows)
echo 🧹 Cleaning up Docker images and containers...

REM Remove old/dangling images
echo 🗑️ Removing dangling images...
docker image prune -f

REM Remove unused containers
echo 🗑️ Removing unused containers...
docker container prune -f

REM Remove unused networks
echo 🗑️ Removing unused networks...
docker network prune -f

REM Remove unused volumes
echo 🗑️ Removing unused volumes...
docker volume prune -f

REM Remove old versions of our runner images (if any)
echo 🗑️ Removing old runner images...
for /f "tokens=3" %%i in ('docker images ^| findstr /R "runner code-exec" ^| findstr /V "latest"') do docker rmi %%i 2>nul

REM Show current images
echo.
echo 📋 Current runner images:
docker images | findstr /R "cpp-runner c-runner python-runner go-runner node-runner typescript-runner rust-runner php-runner ruby-runner" || echo No runner images found

echo.
echo 💾 Docker disk usage:
docker system df

echo.
echo ✅ Cleanup completed!
pause
