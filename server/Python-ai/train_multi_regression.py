import numpy as np
import requests
import joblib

from sklearn.preprocessing import MinMaxScaler

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (
    LSTM,
    Dense,
    Dropout
)

symbols = [

    "BTCUSDT",

    "ETHUSDT",

    "SOLUSDT"
]

for symbol in symbols:

    print(f"Training {symbol}")

    # =========================
    # FETCH DATA
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
    # SCALE
    # =========================

    scaler = MinMaxScaler()

    scaled =scaler.fit_transform(prices)

    joblib.dump(

        scaler,

        f"models/{symbol}_scaler.pkl"
    )

    # =========================
    # DATASET
    # =========================

    window_size = 20

    X = []
    y = []

    for i in range(

        len(scaled)
        - window_size
    ):

        X.append(
            scaled[
                i:i+window_size
            ]
        )

        y.append(
            scaled[
                i+window_size
            ]
        )

    X = np.array(X)
    y = np.array(y)

    # =========================
    # MODEL
    # =========================

    model = Sequential()

    model.add(

        LSTM(
            64,
            return_sequences=True,
            input_shape=(window_size, 1)
        )
    )

    model.add(Dropout(0.2))

    model.add(LSTM(32))

    model.add(Dense(16, activation="relu"))

    model.add(Dense(1))

    model.compile(

        optimizer="adam",

        loss="mse"
    )

    model.fit(

        X,
        y,

        epochs=10,

        batch_size=16
    )

    # =========================
    # SAVE
    # =========================

    model.save(

        f"models/{symbol}_regression.h5"
    )

    print(f"✅ {symbol} trained")