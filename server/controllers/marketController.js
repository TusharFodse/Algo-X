const {
  getHistoricalPrices
} = require("../services/dataService");

exports.getChartData =
async (req, res) => {

  try {

    const symbol =
      req.query.symbol || "BTCUSDT";
      const interval=req.query.interval || "5m"
      const limit =Number(req.query.limit) || 50;

    const prices =
      await getHistoricalPrices(
        symbol,
        interval,
        limit
      );

    const chartData =
      prices.map((price, index) => ({

        time: index + 1,

        price

      }));

    res.json(chartData);

  } catch (err) {

    console.log(err);

    res.status(500).json({
      error: "Chart fetch failed"
    });
  }
};