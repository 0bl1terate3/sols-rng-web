@echo off
echo Starting Sol's RNG Backend Server...
echo.

cd backend

echo Checking for dependencies...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting server...
call npm start
