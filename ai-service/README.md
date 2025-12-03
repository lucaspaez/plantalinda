# Python AI Service for Cannabis Plant Diagnosis

This service provides AI-powered plant disease and pest detection using computer vision.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Run the service:
```bash
uvicorn main:app --reload --port 8000
```

## API Endpoints

- `POST /analyze` - Analyze plant image for diseases/pests
  - Input: Multipart form with image file
  - Output: JSON with diagnosis results

## Model

Uses a pre-trained image classification model fine-tuned for plant disease detection.
