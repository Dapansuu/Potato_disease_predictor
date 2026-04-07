from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import numpy as np
import uvicorn
from io import BytesIO
from PIL import Image
import tensorflow as tf
import os


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://potato-disease-api.onrender.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = tf.keras.models.load_model("potato_model.keras")

class_names = ["Potato___Early_blight", "Potato___Late_blight", "Potato___healthy"]



def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")
    image = np.array(image)
    return image.astype(np.float32)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())
    image_batch = np.expand_dims(image, axis=0)

    prediction = model.predict(image_batch, verbose=0)[0]

    predicted_class = class_names[np.argmax(prediction)]
    confidence = float(np.max(prediction))

    return {
        "class": predicted_class,
        "confidence": confidence,

    }


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)