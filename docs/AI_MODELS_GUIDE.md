# 🤖 Guía para Cambiar Modelos de IA

## Método 1: Editar config.yaml (Recomendado)

### Paso 1: Editar el archivo de configuración

Abre `ai-service/config.yaml` y cambia el `model_name`:

```yaml
# Modelo actual
model_name: "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

# Cambiar a otro modelo (ejemplo)
model_name: "nateraw/vit-base-beans"
```

### Paso 2: Reiniciar el servicio

**Opción A - Reinicio manual:**
1. Detén el servicio (Ctrl+C en la terminal)
2. Ejecuta: `.\start-ai-service.bat`

**Opción B - Recarga automática:**
```bash
curl -X POST http://localhost:8000/reload-model
```

---

## Método 2: Usar tu Propio Modelo

### Opción A: Entrenar desde cero

1. **Recolectar datos**
   - Fotos de plantas con diferentes problemas
   - Etiquetadas correctamente (deficiencia N, plagas, etc.)
   - Mínimo 100 imágenes por categoría

2. **Entrenar el modelo**
```python
# Ejemplo con PyTorch
from transformers import AutoModelForImageClassification, TrainingArguments, Trainer

model = AutoModelForImageClassification.from_pretrained(
    "google/vit-base-patch16-224",
    num_labels=12  # Número de categorías
)

# Entrenar con tus datos
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset
)

trainer.train()
```

3. **Subir a Hugging Face**
```python
model.push_to_hub("tu-usuario/plantalinda-disease-detector")
```

4. **Usar en la app**
```yaml
# config.yaml
model_name: "tu-usuario/plantalinda-disease-detector"
```

### Opción B: Fine-tuning de modelo existente

```python
# Partir de un modelo pre-entrenado y ajustarlo con tus datos
from transformers import AutoModelForImageClassification

base_model = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
model = AutoModelForImageClassification.from_pretrained(base_model)

# Congelar capas base
for param in model.base_model.parameters():
    param.requires_grad = False

# Entrenar solo la capa de clasificación con tus datos
# ... código de entrenamiento ...
```

---

## Modelos Recomendados de Hugging Face

### Para Plantas en General
```yaml
model_name: "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"
# Pros: Rápido, ligero, buena precisión general
# Contras: No específico para plantalinda
```

### Para Detección de Enfermedades
```yaml
model_name: "nateraw/vit-base-beans"
# Pros: Vision Transformer, buena para detalles finos
# Contras: Más lento, requiere más memoria
```

### Para Clasificación General
```yaml
model_name: "google/vit-base-patch16-224"
# Pros: Muy versátil, se puede fine-tunear fácilmente
# Contras: Genérico, necesita fine-tuning para plantalinda
```

---

## Método 3: Usar Múltiples Modelos (Ensemble)

Puedes modificar `main.py` para usar varios modelos y combinar sus predicciones:

```python
# Cargar múltiples modelos
models = {
    "disease": AutoModelForImageClassification.from_pretrained("modelo1"),
    "pest": AutoModelForImageClassification.from_pretrained("modelo2"),
    "deficiency": AutoModelForImageClassification.from_pretrained("modelo3")
}

# Combinar predicciones
def ensemble_predict(image):
    predictions = []
    for name, model in models.items():
        pred = model(image)
        predictions.append(pred)
    
    # Votar o promediar
    final_prediction = combine_predictions(predictions)
    return final_prediction
```

---

## Método 4: Usar APIs Externas

### OpenAI Vision API
```python
import openai

def analyze_with_gpt4_vision(image_url):
    response = openai.ChatCompletion.create(
        model="gpt-4-vision-preview",
        messages=[{
            "role": "user",
            "content": [
                {"type": "text", "text": "Diagnose this plantalinda plant"},
                {"type": "image_url", "image_url": image_url}
            ]
        }]
    )
    return response.choices[0].message.content
```

### Google Cloud Vision API
```python
from google.cloud import vision

def analyze_with_google_vision(image_path):
    client = vision.ImageAnnotatorClient()
    
    with open(image_path, 'rb') as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    response = client.label_detection(image=image)
    
    return response.label_annotations
```

---

## Comparación de Modelos

| Modelo | Velocidad | Precisión | Memoria | Especialización |
|--------|-----------|-----------|---------|-----------------|
| MobileNetV2 | ⚡⚡⚡ | ⭐⭐⭐ | 💾 | General |
| ViT-Base | ⚡⚡ | ⭐⭐⭐⭐ | 💾💾 | Detalles finos |
| ResNet50 | ⚡⚡ | ⭐⭐⭐ | 💾💾 | Robusto |
| EfficientNet | ⚡⚡⚡ | ⭐⭐⭐⭐ | 💾 | Balanceado |
| Custom (tuyo) | ⚡⚡ | ⭐⭐⭐⭐⭐ | 💾💾 | plantalinda específico |

---

## Endpoints Útiles del Servicio

### Ver modelo actual
```bash
curl http://localhost:8000/
```

### Listar modelos disponibles
```bash
curl http://localhost:8000/models
```

### Recargar modelo
```bash
curl -X POST http://localhost:8000/reload-model
```

### Analizar imagen
```bash
curl -X POST http://localhost:8000/analyze \
  -F "file=@planta.jpg"
```

---

## Consejos para Mejorar la Precisión

1. **Datos de Calidad**
   - Fotos claras, bien iluminadas
   - Diferentes ángulos
   - Variedad de condiciones

2. **Data Augmentation**
   - Rotaciones
   - Cambios de brillo
   - Recortes aleatorios

3. **Transfer Learning**
   - Partir de modelo pre-entrenado
   - Fine-tuning con tus datos

4. **Ensemble de Modelos**
   - Combinar predicciones de varios modelos
   - Más robusto pero más lento

5. **Validación Cruzada**
   - Dividir datos en train/validation/test
   - Evitar overfitting

---

## Troubleshooting

### Modelo no carga
- Verificar nombre correcto en Hugging Face
- Verificar conexión a internet
- Verificar espacio en disco

### Predicciones incorrectas
- Revisar calidad de datos de entrenamiento
- Ajustar threshold de confianza
- Probar otro modelo

### Servicio muy lento
- Usar modelo más ligero (MobileNet)
- Habilitar GPU si disponible
- Reducir tamaño de imágenes

---

**¿Necesitas ayuda para entrenar tu propio modelo?** Avísame y te guío paso a paso.
