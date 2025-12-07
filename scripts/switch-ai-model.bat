@echo off
echo ========================================
echo Cannabis AI - Model Switcher
echo ========================================
echo.
echo Current available models:
echo.
echo 1. MobileNetV2 - Plant Disease (Default)
echo    Fast, lightweight, general plant diseases
echo.
echo 2. ViT-Base - Bean Disease Detection
echo    Slower, more accurate for detailed analysis
echo.
echo 3. ViT-Base - General Vision Classifier
echo    Versatile, good for fine-tuning
echo.
echo 4. Custom Model (Enter Hugging Face model name)
echo.
echo 5. Exit
echo.

set /p choice="Select model (1-5): "

if "%choice%"=="1" (
    set model_name=linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification
    goto update_config
)

if "%choice%"=="2" (
    set model_name=nateraw/vit-base-beans
    goto update_config
)

if "%choice%"=="3" (
    set model_name=google/vit-base-patch16-224
    goto update_config
)

if "%choice%"=="4" (
    set /p model_name="Enter Hugging Face model name: "
    goto update_config
)

if "%choice%"=="5" (
    echo Exiting...
    exit /b 0
)

echo Invalid choice!
pause
exit /b 1

:update_config
echo.
echo Updating config.yaml with model: %model_name%
echo.

cd ai-service

(
echo # AI Model Configuration
echo # Change the model_name to use different pre-trained models from Hugging Face
echo.
echo # Current model: Plant disease detection
echo model_name: "%model_name%"
echo.
echo # Model settings
echo confidence_threshold: 0.5
echo use_gpu: false  # Set to true if you have CUDA-capable GPU
) > config.yaml

echo.
echo ========================================
echo Configuration updated successfully!
echo ========================================
echo.
echo Model: %model_name%
echo.
echo To apply changes:
echo 1. Stop the AI service (Ctrl+C)
echo 2. Run: .\start-ai-service.bat
echo.
echo Or reload without restart:
echo   curl -X POST http://localhost:8000/reload-model
echo.
pause
