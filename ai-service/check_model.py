from transformers import AutoImageProcessor, AutoModelForImageClassification
import sys

print("Attempting to load model 'liriope/PlantDiseaseDetection'...")

try:
    model_name = "liriope/PlantDiseaseDetection"
    # Force download to see if network works
    processor = AutoImageProcessor.from_pretrained(model_name)
    print("Processor loaded.")
    model = AutoModelForImageClassification.from_pretrained(model_name)
    print("Model loaded successfully!")
    
    # Check labels
    print(f"Number of labels: {len(model.config.id2label)}")
    print("Sample labels:", list(model.config.id2label.values())[:5])
    
except Exception as e:
    print(f"CRITICAL ERROR: {e}")
    sys.exit(1)
