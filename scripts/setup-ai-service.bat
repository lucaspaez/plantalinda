@echo off
echo ========================================
echo Cannabis AI Service Setup
echo ========================================
echo.

cd ai-service

echo Checking Python installation...
python --version
if %errorlevel% neq 0 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.11 or higher
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo To start the AI service, run:
echo   cd ai-service
echo   python -m uvicorn main:app --reload --port 8000
echo.
pause
