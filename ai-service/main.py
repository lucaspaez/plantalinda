from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import io
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from typing import Dict
import logging
import yaml
import os

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Cannabis Plant Diagnosis AI Service")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8081"],  # Spring Boot backend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load configuration
def load_config():
    config_path = os.path.join(os.path.dirname(__file__), "config.yaml")
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            return yaml.safe_load(f)
    return {
        "model_name": "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
        "confidence_threshold": 0.5,
        "use_gpu": False
    }

config = load_config()

# Global model variables
model = None
processor = None
current_model_name = None

# Disease/Issue mapping with corrective actions
ISSUE_ACTIONS = {
    "nitrogen_deficiency": {
        "issue": "Nitrogen Deficiency",
        "action": "Apply nitrogen-rich fertilizer (NPK 10-5-5). Increase feeding frequency. Monitor leaf color recovery over 5-7 days."
    },
    "phosphorus_deficiency": {
        "issue": "Phosphorus Deficiency",
        "action": "Use bloom fertilizer with higher P ratio (NPK 5-10-5). Check pH levels (6.0-7.0 for soil). Flush if nutrient lockout suspected."
    },
    "potassium_deficiency": {
        "issue": "Potassium Deficiency",
        "action": "Apply potassium supplement or bloom booster. Ensure proper pH. Monitor leaf edges for improvement."
    },
    "calcium_deficiency": {
        "issue": "Calcium Deficiency",
        "action": "Add CalMag supplement. Check pH and ensure proper watering schedule. Increase humidity if too low."
    },
    "magnesium_deficiency": {
        "issue": "Magnesium Deficiency",
        "action": "Apply Epsom salt solution (1 tsp/gallon). Adjust pH to optimal range. Reduce potassium if excessive."
    },
    "spider_mites": {
        "issue": "Spider Mites Infestation",
        "action": "Isolate plant immediately. Spray with neem oil or insecticidal soap. Increase humidity. Repeat treatment every 3 days for 2 weeks."
    },
    "powdery_mildew": {
        "issue": "Powdery Mildew",
        "action": "Remove affected leaves. Improve air circulation. Apply fungicide or milk spray (1:9 ratio). Reduce humidity below 50%."
    },
    "bud_rot": {
        "issue": "Bud Rot (Botrytis)",
        "action": "Remove infected buds immediately. Improve ventilation. Reduce humidity to 40-45%. Increase airflow around plants."
    },
    "heat_stress": {
        "issue": "Heat Stress",
        "action": "Lower temperature to 20-26°C. Increase air circulation. Ensure adequate watering. Provide shade if needed."
    },
    "light_burn": {
        "issue": "Light Burn",
        "action": "Raise lights 10-15cm higher. Reduce light intensity. Monitor top leaves for recovery. Ensure proper distance maintained."
    },
    "overwatering": {
        "issue": "Overwatering",
        "action": "Allow soil to dry between waterings. Improve drainage. Reduce watering frequency. Check for root rot."
    },
    "healthy": {
        "issue": "Healthy Plant",
        "action": "Continue current care routine. Monitor regularly for any changes. Maintain optimal environmental conditions."
    }
}

@app.on_event("startup")
async def load_model():
    """Load the AI model on startup"""
    global model, processor, current_model_name
    try:
        model_name = config.get("model_name", "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification")
        logger.info(f"Loading AI model: {model_name}")
        
        processor = AutoImageProcessor.from_pretrained(model_name)
        model = AutoModelForImageClassification.from_pretrained(model_name)
        
        # Use GPU if available and configured
        if config.get("use_gpu", False) and torch.cuda.is_available():
            model = model.cuda()
            logger.info("Using GPU for inference")
        else:
            model.eval()
            logger.info("Using CPU for inference")
        
        current_model_name = model_name
        logger.info("Model loaded successfully!")
    except Exception as e:
        logger.error(f"Error loading model: {e}")
        model = None
        processor = None
        current_model_name = None

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "service": "Cannabis Plant Diagnosis AI",
        "status": "running",
        "model_loaded": model is not None,
        "current_model": current_model_name,
        "config": config
    }

@app.get("/models")
async def list_models():
    """List available models and current configuration"""
    return {
        "current_model": current_model_name,
        "available_models": [
            {
                "name": "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
                "description": "Plant disease identification (general)",
                "type": "MobileNetV2"
            },
            {
                "name": "nateraw/vit-base-beans",
                "description": "Bean disease detection",
                "type": "Vision Transformer"
            },
            {
                "name": "google/vit-base-patch16-224",
                "description": "General vision classifier",
                "type": "Vision Transformer"
            }
        ],
        "note": "To change model, edit config.yaml and restart the service"
    }

@app.post("/reload-model")
async def reload_model():
    """Reload the model from config (useful after changing config.yaml)"""
    global config
    config = load_config()
    await load_model()
    return {
        "status": "success",
        "message": "Model reloaded",
        "current_model": current_model_name
    }

@app.post("/analyze")
async def analyze_plant(file: UploadFile = File(...)) -> Dict:
    """
    Analyze plant image for diseases, pests, or deficiencies
    
    Returns:
        - predicted_issue: The identified problem
        - confidence: Confidence score (0-1)
        - corrective_action: Recommended action to fix the issue
        - model_used: Name of the model that performed the analysis
    """
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")
        
        # Run inference
        if model is not None and processor is not None:
            # Real AI inference
            inputs = processor(images=image, return_tensors="pt")
            
            # Move to GPU if configured
            if config.get("use_gpu", False) and torch.cuda.is_available():
                inputs = {k: v.cuda() for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits
                probabilities = torch.nn.functional.softmax(logits, dim=-1)
                predicted_class_idx = logits.argmax(-1).item()
                confidence = probabilities[0][predicted_class_idx].item()
            
            # Map model output to our issue categories
            issue_key = map_model_output_to_issue(predicted_class_idx, model.config.id2label)
            
        else:
            # Fallback: Mock response if model not loaded
            logger.warning("Model not loaded, returning mock response")
            issue_key = "nitrogen_deficiency"
            confidence = 0.85
        
        # Get issue details
        issue_data = ISSUE_ACTIONS.get(issue_key, ISSUE_ACTIONS["healthy"])
        
        return {
            "predicted_issue": issue_data["issue"],
            "confidence": round(confidence, 3),
            "corrective_action": issue_data["action"],
            "model_used": current_model_name or "fallback"
        }
        
    except Exception as e:
        logger.error(f"Error analyzing image: {e}")
        raise HTTPException(status_code=500, detail=f"Error processing image: {str(e)}")

def map_model_output_to_issue(class_idx: int, id2label: Dict) -> str:
    """
    Map the model's output class to our issue categories
    This is a simplified mapping - in production, you'd train a custom model
    """
    label = id2label.get(class_idx, "").lower()
    
    # Simple keyword matching
    if "nitrogen" in label or "yellow" in label:
        return "nitrogen_deficiency"
    elif "phosphorus" in label or "purple" in label:
        return "phosphorus_deficiency"
    elif "potassium" in label:
        return "potassium_deficiency"
    elif "calcium" in label:
        return "calcium_deficiency"
    elif "magnesium" in label:
        return "magnesium_deficiency"
    elif "mite" in label or "spider" in label:
        return "spider_mites"
    elif "mildew" in label or "powder" in label:
        return "powdery_mildew"
    elif "rot" in label or "botrytis" in label:
        return "bud_rot"
    elif "heat" in label or "burn" in label:
        return "heat_stress"
    elif "light" in label:
        return "light_burn"
    elif "water" in label:
        return "overwatering"
    elif "healthy" in label or "normal" in label:
        return "healthy"
    else:
        # Default to nitrogen deficiency as it's most common
        return "nitrogen_deficiency"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
