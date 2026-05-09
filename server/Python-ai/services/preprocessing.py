import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler

SCALER_PATH = "model/scaler.pkl"

# =========================
# Build Features
# =========================
def build_features(prices):

    features = []

    for i in range(2, len(prices)):

        change = (prices[i] - prices[i - 1]) / prices[i - 1]

        momentum = prices[i] - prices[i - 2]

        volatility = abs(prices[i] - prices[i - 1])

        features.append([
            prices[i],
            change,
            momentum,
            volatility
        ])

    return np.array(features)


# =========================
# Fit Scaler
# =========================
def fit_scaler(features):

    scaler = StandardScaler()

    scaled = scaler.fit_transform(features)

    joblib.dump(scaler, SCALER_PATH)

    return scaled


# =========================
# Load Scaler
# =========================
def load_scaler():
    return joblib.load(SCALER_PATH)