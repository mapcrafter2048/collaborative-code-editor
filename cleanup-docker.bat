@echo off
REM Docker cleanup script for Collaborative Code Editor (Windows)
echo 🧹 Cleaning up Docker images and containers...

REM Stop any running containers using our images
echo 🔄 Stopping any running containers...
for /f %%i in ('docker ps -q --filter "ancestor=cpp-runner" --filter "ancestor=python-runner" --filter "ancestor=go-runner" --filter "ancestor=node-runner" --filter "ancestor=rust-runner" --filter "ancestor=php-runner" --filter "ancestor=ruby-runner" --filter "ancestor=c-runner" --filter "ancestor=typescript-runner"') do docker stop %%i >nul 2>&1

REM Remove old/unused containers
echo 🗑️ Removing unused containers...
docker container prune -f >nul 2>&1

REM Remove old versions of our images
echo 🗑️ Removing old runner images...
docker rmi cpp-runner:latest >nul 2>&1
docker rmi python-runner:latest >nul 2>&1
docker rmi go-runner:latest >nul 2>&1
docker rmi node-runner:latest >nul 2>&1
docker rmi rust-runner:latest >nul 2>&1
docker rmi php-runner:latest >nul 2>&1
docker rmi ruby-runner:latest >nul 2>&1
docker rmi c-runner:latest >nul 2>&1
docker rmi typescript-runner:latest >nul 2>&1

REM Remove dangling images
echo 🗑️ Removing dangling images...
docker image prune -f >nul 2>&1

REM Remove unused volumes
echo 🗑️ Removing unused volumes...
docker volume prune -f >nul 2>&1

REM Remove unused networks
echo 🗑️ Removing unused networks...
docker network prune -f >nul 2>&1

REM Show current space usage
echo 📊 Current Docker space usage:
docker system df

echo.
echo ✅ Cleanup completed!
echo 💡 To rebuild images, run: setup.bat
echo 💡 For aggressive cleanup of ALL unused Docker data, run: docker system prune -a -f

pause
