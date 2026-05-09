import sys
import requests
import numpy as np

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
from tensorflow.keras.optimizers import Adam

from services.preprocessing import (
    build_features,
    fit_scaler
)

# =====================================
# GET SYMBOL FROM TERMINAL
# =====================================

symbol = "BTCUSDT"

if len(sys.argv) > 1:

    symbol = sys.argv[1]

print(f"📊 Training model for {symbol}")

# =====================================
# MODEL PATH
# =====================================

MODEL_PATH = f"models/{symbol}.h5"

# =====================================
# FETCH MARKET DATA
# =====================================

url = (
    f"https://api.binance.com/api/v3/klines"
    f"?symbol={symbol}"
    f"&interval=1m"
    f"&limit=1000"
)

res = requests.get(url)

candles = res.json()

# validation
if not isinstance(candles, list):

    print("❌ Binance API error")

    print(candles)

    exit()

prices = [float(c[4]) for c in candles]

print(f"✅ Loaded {len(prices)} prices")

# =====================================
# FEATURES
# =====================================

features = build_features(prices)

normalized = fit_scaler(features)

# =====================================
# DATASET
# =====================================

window_size = 20

X = []
y = []

for i in range(
    len(normalized)
    - window_size
    - 1
):

    X.append(
        normalized[
            i:i+window_size
        ]
    )

    current =prices[i + window_size]

    next_price =prices[i + window_size + 1]

    y.append(

        1 if next_price > current

        else 0
    )

X = np.array(X)

y = np.array(y)

print(f"✅ Dataset: {X.shape}")

# =====================================
# MODEL
# =====================================

model = Sequential()

model.add(

    LSTM(

        64,

        return_sequences=True,

        input_shape=(window_size, 4)
    )
)

model.add(Dropout(0.2))

model.add(LSTM(32))

model.add(Dense(16, activation="relu"))

model.add(Dense(1, activation="sigmoid"))

# =====================================
# COMPILE
# =====================================

model.compile(

    optimizer=Adam(0.001),

    loss="binary_crossentropy",

    metrics=["accuracy"]
)

# =====================================
# EARLY STOPPING
# =====================================

early_stop = EarlyStopping(

    patience=5,

    restore_best_weights=True
)

# =====================================
# TRAIN
# =====================================

model.fit(

    X,

    y,

    epochs=30,

    batch_size=16,

    validation_split=0.2,

    callbacks=[early_stop],

    shuffle=True
)

# =====================================
# SAVE MODEL
# =====================================

model.save(MODEL_PATH)

print(f"✅ Saved: {MODEL_PATH}")