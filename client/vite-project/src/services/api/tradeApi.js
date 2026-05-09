import api from "./axios";

export async function runTrade(
  symbol,
  walletAddress
) {

  const res =
    await api.post(

      "/trade/run",

      {
        symbol,
        walletAddress
      }
    );

  return res.data;
}