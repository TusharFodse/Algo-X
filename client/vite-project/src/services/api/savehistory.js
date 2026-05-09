import axios from "axios";

export async function saveTradeHistory(
  data
) {

  const res =
    await axios.post(

      "http://localhost:5000/api/history/save",

      data
    );

  return res.data;
}