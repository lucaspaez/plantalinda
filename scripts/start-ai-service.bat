@echo off
echo Starting Cannabis AI Service...
cd ai-service
python -m uvicorn main:app --reload --port 8000

