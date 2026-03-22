# 🥔 Potato Disease Predictor

A deep learning-based web application that detects diseases in potato plants from leaf images. Upload a photo of a potato leaf and get an instant prediction of whether the plant is healthy or affected by **Early Blight** or **Late Blight**.

---

## 📌 Overview

Potato crops are highly susceptible to diseases that can devastate yields if not caught early. This project uses a Convolutional Neural Network (CNN) trained on potato leaf images to classify the plant's health status, and exposes the model via a **FastAPI** backend with a **JavaScript frontend**.

---

## 🗂️ Project Structure

```
Potato_disease_predictor/
│
├── api/                        # FastAPI backend
│   └── main.py                 # API endpoints for prediction
│
├── frontend/                   # Web frontend (JS/CSS)
│
├── potato_disease.ipynb        # Model training notebook
├── requirements.txt            # Python dependencies
├── .gitignore
└── README.md
```

---

## 🧠 Model

The model is built and trained in `potato_disease.ipynb` using:

- **Framework**: TensorFlow / Keras
- **Architecture**: Convolutional Neural Network (CNN)
- **Classes**:
  - `Potato___Early_Blight`
  - `Potato___Late_Blight`
  - `Potato___Healthy`
- **Dataset**: [PlantVillage Dataset](https://www.kaggle.com/datasets/arjuntejaswi/plant-village)

---

## 🛠️ Tech Stack

| Layer     | Technology                  |
|-----------|-----------------------------|
| ML Model  | TensorFlow 2.19.1           |
| Backend   | FastAPI + Uvicorn           |
| Serving   | TensorFlow Serving 2.9.0    |
| Frontend  | JavaScript / CSS            |
| Image I/O | Pillow                      |
| Utilities | NumPy, Matplotlib           |

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.8+
- pip

### 1. Clone the Repository

```bash
git clone https://github.com/Dapansuu/Potato_disease_predictor.git
cd Potato_disease_predictor
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Train the Model (Optional)

Open and run `potato_disease.ipynb` in Jupyter Notebook or VS Code to train and save the model.

```bash
jupyter notebook potato_disease.ipynb
```

### 4. Start the API Server

```bash
cd api
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

### 5. Launch the Frontend

Open the `frontend/` folder and serve it with any static server, or simply open `index.html` in your browser.

---

## 🔌 API Usage

### `POST /predict`

Upload a potato leaf image to receive a disease prediction.

**Request:**
```
Content-Type: multipart/form-data
Body: file=<image file>
```

**Response:**
```json
{
  "class": "Potato___Early_Blight",
  "confidence": 0.97
}
```

---

## 📊 Disease Classes

| Class | Description |
|---|---|
| **Early Blight** | Caused by *Alternaria solani*; appears as dark brown spots with concentric rings |
| **Late Blight** | Caused by *Phytophthora infestans*; water-soaked lesions that turn dark brown |
| **Healthy** | No disease detected |

---

## 📦 Requirements

```
tensorflow==2.19.1
fastapi
uvicorn
python-multipart
pillow
tensorflow-serving-api==2.9.0
matplotlib
numpy
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Dapansuu** — [GitHub Profile](https://github.com/Dapansuu)