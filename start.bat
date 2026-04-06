@echo off
echo ========================================
echo   FOG OF WAR - Quick Start
echo ========================================
echo.

cd client

echo [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: npm install failed
    pause
    exit /b 1
)

echo.
echo [2/3] Building project...
call npm run build
if %errorlevel% neq 0 (
    echo ERROR: Build failed
    pause
    exit /b 1
)

echo.
echo [3/3] Starting dev server...
echo.
echo ========================================
echo   Server starting at http://localhost:5173
echo   Press Ctrl+C to stop
echo ========================================
echo.

call npm run dev
