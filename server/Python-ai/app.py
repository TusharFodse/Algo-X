from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import joblib
from tensorflow.keras.models import load_model

from services.preprocessing import (
    build_features,
    load_scaler
)

app = Flask(__name__)
CORS(app)

# ====================================
# CACHE LOADED MODELS
# ====================================

loaded_models = {}
loaded_regression_models = {}

loaded_regression_scalers = {}
# ====================================
# LOAD MODEL BY SYMBOL
# ====================================
def get_regression_model(symbol):

    if symbol not in loaded_regression_models:

        model_path = (
            f"models/{symbol}_regression.h5"
        )

        scaler_path = (
            f"models/{symbol}_scaler.pkl"
        )

        loaded_regression_models[symbol] = (

            load_model(
                model_path,
                compile=False
            )
        )

        loaded_regression_scalers[symbol] = (

            joblib.load(scaler_path)
        )

        print(
            f"✅ Loaded Regression Model: {symbol}"
        )

    return (

        loaded_regression_models[symbol],

        loaded_regression_scalers[symbol]
    )
def get_model(symbol):

    if symbol not in loaded_models:

        path = f"models/{symbol}.h5"

        loaded_models[symbol] = load_model(

            path,
            compile=False
        )

        print(f"✅ Loaded model: {symbol}")

    return loaded_models[symbol]
# ====================================
# LOAD SCALER
# ====================================

scaler = load_scaler()

# ====================================
# PREDICT
# ====================================

@app.route("/predict", methods=["POST"])

def predict():

    try:

        data = request.json

        prices = data["prices"]

        symbol = data["symbol"]

        # load correct model
        model = get_model(symbol)

        # features
        features = build_features(prices)

        normalized = scaler.transform(features)

        window_size = 20

        input_data = normalized[-window_size:]

        X = np.array([input_data])

        # prediction
        prediction = model.predict(X)[0][0]

        signal = "HOLD"

        if prediction > 0.65:
            signal = "BUY"

        elif prediction < 0.35:
            signal = "SELL"

        confidence = abs(prediction - 0.5) * 2

        # Predict Future by Formula
        last_price = prices[-1]

        forecast = []

        future_price = last_price

        # generate 5 future candles

        for i in range(5):

            if signal == "BUY":

                future_price *= 1.002

            elif signal == "SELL":

                future_price *= 0.998

            else:

                future_price *= 1.0002

            forecast.append(
                round(future_price, 2)
            )

        return jsonify({

            "signal": signal,

            "confidence": float(confidence),

            "probability": float(prediction),
            "forecast": forecast
        })

    except Exception as e:

        return jsonify({

            "error": str(e)
        }), 500

@app.route("/forecast", methods=["POST"])

def forecast():

    try:

        data = request.json

        symbol = data["symbol"]

        prices = np.array(

            data["prices"]

        ).reshape(-1, 1)

        # load model
        model, scaler = (

            get_regression_model(symbol)
        )

        # scale
        scaled = scaler.transform(prices)

        # last 20 candles
        window = scaled[-20:]

        X = window.reshape(1, 20, 1)

        # predict
        prediction = (

            model.predict(X)[0][0]
        )

        # inverse scale
        predicted_price = (

            scaler.inverse_transform(

                [[prediction]]

            )[0][0]
        )

        return jsonify({

            "symbol": symbol,

            "predictedPrice":

                float(predicted_price)
        })

    except Exception as e:

        # except Exception as e:

        print("FORECAST ERROR:", e)

        return jsonify({

        "error": str(e)

    }), 500
# ====================================
# START SERVER
# ====================================

if __name__ == "__main__":

    app.run(port=5001)