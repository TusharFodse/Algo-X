// require("dotenv").config();
// const app = require("./app");
// const connectDB = require("./config/db");

// connectDB();

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });
require("dotenv").config();

global.crypto = require("crypto");

const app = require("./app");
const connectDB = require("./config/db");
const historyRoutes =require("./routes/historyRoutes");
const portfolioRoutes=require("./routes/portfolioRoutes")
async function start() {

  try {
    app.use("/api/history",historyRoutes);
    app.use(
  "/api/portfolio",
  portfolioRoutes
);
app.use(
  "/api/model",
  require("./routes/modelRoutes")
);

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {

    console.error("❌ Startup error:", err.message);
  }
}

start();