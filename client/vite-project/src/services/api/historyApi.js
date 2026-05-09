import api from "./axios";

export async function getHistory(
  walletAddress
) {

  const res =
    await api.get(

      `/history?walletAddress=${walletAddress}`
    );

  return res.data;
}