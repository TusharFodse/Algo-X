import api from "./axios";

export async function getChartData(
      symbol,
     interval = "5m",
    limit = 50
) {

  const res = await api.get(
     `/market/chart?symbol=${symbol}&interval=${interval}&limit=${limit}`
  );

  return res.data;
}