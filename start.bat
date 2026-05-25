@echo off
cd /d "%~dp0"

if not exist node_modules (
    echo npm install...
    call npm install
)

echo Starting server...
start /B node server.js

timeout /t 3 /nobreak >nul
start http://localhost:3000

echo.
echo Press any key to stop server...
pause >nul
taskkill /f /im node.exe >nul 2>&1
