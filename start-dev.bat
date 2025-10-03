@echo off
REM MySharpJobs Full Stack Development Server Launcher (Windows CMD)
REM This script starts the Laravel backend, Reverb WebSocket server, and React frontend

echo.
echo ================================
echo MySharpJobs Full Stack Dev Server
echo ================================
echo.
echo Services will start on:
echo   Frontend (React):    http://localhost:5173
echo   Backend (Laravel):   http://localhost:8000
echo   WebSocket (Reverb):  ws://localhost:6001
echo.
echo Press Ctrl+C to stop all servers
echo.

cd backend

echo Starting all services...
echo.

REM Run composer dev command
composer dev

cd ..
