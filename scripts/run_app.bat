@echo off

echo ===================================================
echo   Corporate Expense Tracker - DEBUG MODE
echo ===================================================

:: Root directory is the parent of the scripts folder
for %%I in ("%~dp0..") do set "ROOT_DIR=%%~fI"
cd /d "%ROOT_DIR%"
echo Current Directory: "%CD%"

:: Check for Node.js
echo.
echo [CHECK] Checking for Node.js...
where node
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js command not found!
    echo Please install Node from https://nodejs.org/
    pause
    exit /b
)
node -v

:: Check for npm
echo.
echo [CHECK] Checking for npm...
where npm
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm command not found!
    pause
    exit /b
)
call npm -v

:: Check folders
echo.
echo [CHECK] Checking folders...
if not exist "src\server" echo [FAILED] Folder 'src\server' missing!
if not exist "src\client" echo [FAILED] Folder 'src\client' missing!

echo.
echo ---------------------------------------------------
echo SETUP PHASE
echo ---------------------------------------------------

:: 1. Server Setup
echo [1/3] Server...
cd /d "%ROOT_DIR%\src\server"
if not exist "node_modules\" (
    echo Installing server dependencies...
    call npm install
    echo Seeding database with new user names...
    call npm run seed
) else (
    echo Server modules already exist.
)

:: 2. Client Setup
echo.
echo [2/3] Client...
cd /d "%ROOT_DIR%\src\client"
if not exist "node_modules\" (
    echo Installing client dependencies...
    call npm install
) else (
    echo Client modules already exist.
)

echo.
echo ---------------------------------------------------
echo STARTING SERVICES
echo ---------------------------------------------------

:: Start Server
cd /d "%ROOT_DIR%\src\server"
start "Server" cmd /k "npm start || pause"

:: Start Client
cd /d "%ROOT_DIR%\src\client"
start "Client" cmd /k "npm run dev || pause"

echo.
echo Services should be opening in new windows.
echo.
pause
