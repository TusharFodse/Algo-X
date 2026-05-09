import os
import numpy as np
import requests
import sys
import joblib

from tensorflow.keras.models import load_model

# =========================
# BASE DIRECTORY
# =========================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

# =========================
# SYMBOL
# =========================

symbol = sys.argv[1]

# =========================
# PATHS
# =========================

model_path = os.path.join(

    BASE_DIR,

    "models",

    f"{symbol}_regression.h5"
)

scaler_path = os.path.join(

    BASE_DIR,

    "models",

    f"{symbol}_scaler.pkl"
)

# =========================
# LOAD MODEL
# =========================

model = load_model(
    model_path,
    compile=False
)
model.compile(

    optimizer="adam",

    loss="mse"
)

scaler = joblib.load(
    scaler_path
)

# =========================
# FETCH LATEST DATA
# =========================

res = requests.get(
    f"https://api.binance.com/api/v3/klines?symbol={symbol}&interval=1m&limit=1000"
)

candles = res.json()

prices = np.array([
    float(c[4])
    for c in candles
]).reshape(-1, 1)

# =========================
# NORMALIZE
# =========================

scaled =scaler.fit_transform(prices)

joblib.dump(
    scaler,
    scaler_path
)
# =========================
# DATASET
# =========================

window_size = 20
X = []
y = []

for i in range(
    len(scaled) - window_size
):

    X.append(

        scaled[
            i:i+window_size
        ]
    )

    y.append(

        scaled[
            i+window_size
        ][0]
    )

X = np.array(X).reshape(-1, 20, 1)

y = np.array(y)
y = np.array(y)

# =========================
# FINE-TUNE MODEL
# =========================

model.fit(
    X,
    y,
    epochs=3,
    batch_size=16
)

# =========================
# SAVE MODEL
# =========================

model.save(
    f"models/{symbol}_regression.h5"
)

print("Model Fine-Tuned Successfully")