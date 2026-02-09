# 🌱 AgriBuddy – Potato Disease Detection

AgriBuddy is an eco-friendly web application that detects potato diseases from images using computer vision.  
The project aims to support early disease diagnosis, reduce unnecessary pesticide use, and help minimize crop loss through accessible AI-powered tools.

This project was developed as part of a sustainability-focused hackathon.

---

## 🚀 Features
- Image-based potato disease detection
- Simple web interface for uploading images
- Confidence score returned with each prediction
- Lightweight and energy-efficient inference (CPU-based)
- Designed to promote sustainable agricultural practices

---

## 🧠 Tech Stack

### Backend
- Python 3.10
- Flask
- PyTorch
- TorchVision
- NumPy
- Pillow
- Flask-CORS

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript (Fetch API)

---

## 📂 Project Structure

```

AgriBuddy/
├── backend/
│   ├── app.py
│   ├── Potato_Model.pth
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
├── .gitignore
└── README.md

````

---

## 🖥️ Run the Project Locally

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm

---

### 1️⃣ Backend Setup

Navigate to the backend folder:
```bash
cd backend
````

Create a virtual environment:

```bash
python -m venv .venv
```

Activate the virtual environment:

**Windows (Command Prompt):**

```bat
.\.venv\Scripts\activate.bat
```

**Windows (PowerShell):**

```powershell
.\.venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the backend server:

```bash
python app.py
```

The backend will run at:

```
http://127.0.0.1:5000
```

---

### 2️⃣ Frontend Setup

Navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will run at:

```
http://localhost:5173
```

---

## 🧪 Using the Application

1. Open the frontend URL in your browser.
2. Upload an image of a potato or potato leaf.
3. Click the **Predict** button.
4. View the detected disease and confidence score.

---

## ⚠️ Disclaimer

Predictions are probabilistic and intended for educational and demonstration purposes only.
They should be verified by agricultural experts before taking action.

---

## 🌍 Sustainability Impact

By enabling early disease detection, AgriBuddy helps:

* Reduce excessive pesticide usage
* Prevent crop loss
* Support more sustainable and environmentally friendly farming practices

```

