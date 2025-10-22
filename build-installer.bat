@echo off
echo ========================================
echo  Sol's RNG - Installer Builder
echo ========================================
echo.

REM Check if node_modules exists
if not exist "node_modules\" (
    echo [1/2] Installing dependencies...
    echo This may take a few minutes on first run...
    echo.
    call npm install
    if errorlevel 1 (
        echo.
        echo ERROR: Failed to install dependencies!
        echo Make sure Node.js is installed: https://nodejs.org/
        pause
        exit /b 1
    )
    echo.
    echo Dependencies installed successfully!
    echo.
) else (
    echo [1/2] Dependencies already installed
    echo.
)

echo [2/2] Building Windows installer...
echo This will take a few minutes...
echo.
call npm run dist-win

if errorlevel 1 (
    echo.
    echo ERROR: Build failed!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ========================================
echo  SUCCESS! Installer created!
echo ========================================
echo.
echo Your installer is located in: dist\
echo.
echo Look for: Sol's RNG Setup 1.0.0.exe
echo.
echo You can now distribute this installer to others!
echo.
pause
