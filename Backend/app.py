from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torch.nn as nn
import torchvision.transforms as transforms
import torchvision.models as models
from PIL import Image
import os

app = Flask(__name__)
CORS(app)

# ================= DEVICE =================
device = torch.device("cpu")

# ================= GLOBAL MODEL (LAZY) =================
model = None

CLASS_NAMES = [
    "Black Scurf",
    "Blackleg",
    "Blackspot Bruising",
    "Brown Rot",
    "Common Scab",
    "Dry Rot",
    "Healthy Potatoes",
    "Pink Rot",
    "Soft Rot"
]

# ================= TRANSFORMS =================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# ================= MODEL LOADER =================
def load_model():
    global model
    if model is None:
        print("🔄 Loading model...")
        m = models.mobilenet_v2(weights=None)
        m.classifier = nn.Sequential(
            nn.Dropout(0.2),
            nn.Linear(m.last_channel, 256),
            nn.ReLU(),
            nn.Linear(256, 9)
        )

        m.load_state_dict(
            torch.load("Potato_Model.pth", map_location=device)
        )

        m.to(device)
        m.eval()
        model = m
        print("✅ Model loaded")

# ================= ROUTES =================

@app.route("/")
def health():
    return {"status": "AgriBuddy backend running"}

@app.route("/predict", methods=["POST"])
def predict():
    load_model()  # 🔥 model loads only when needed

    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    image = Image.open(request.files["image"]).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        probs = torch.softmax(outputs, dim=1)
        confidence, predicted = torch.max(probs, 1)

    confidence_value = confidence.item()

    response = {
        "prediction": CLASS_NAMES[predicted.item()],
        "confidence": round(confidence_value * 100, 2)
    }

    if confidence_value < 0.6:
        response["note"] = (
            "Low confidence prediction. Image quality or ambiguous symptoms "
            "may affect accuracy."
        )

    return jsonify(response)

# ================= LOCAL RUN =================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host="0.0.0.0", port=port)
