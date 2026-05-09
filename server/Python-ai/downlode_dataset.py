import requests
import pandas as pd

symbol = "BTCUSDT"
interval = "1m"
limit = 1000

url = (
    f"https://api.binance.com/api/v3/klines"
    f"?symbol={symbol}&interval={interval}&limit={limit}"
)

res = requests.get(url)

data = res.json()

rows = []

for candle in data:

    rows.append({
        "timestamp": candle[0],
        "open": float(candle[1]),
        "high": float(candle[2]),
        "low": float(candle[3]),
        "close": float(candle[4]),
        "volume": float(candle[5])
    })

df = pd.DataFrame(rows)

df.to_csv("datasets/btc.csv", index=False)

print("✅ Dataset saved")