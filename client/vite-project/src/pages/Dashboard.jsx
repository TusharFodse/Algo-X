// import DashboardLayout
// from "../../components/layout/DashboardLayout";
import { useState } from "react";
import DashboardLayout from "../components/layout/DashboardLayout";
import PortfolioCard from "../trading/PortfolioCard";
import TradePanel from "../trading/TradePanel";
import TradeHistory from "../trading/TradeHistory";
import PriceChart from "../components/charts/PriceChart";
// import MarketSelector from "../trading/MarketSelector";
// import TradePanel
// from "../../components/trading/TradePanel";

function Dashboard() {

  const [tradeData, setTradeData] =
    useState(null);
  console.log(tradeData)
  return (
    <>
    

    <DashboardLayout>

      <div className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-6
      ">

        <TradePanel
          setTradeData={setTradeData}
        />

        <PortfolioCard />

        <TradeHistory />
        <PriceChart/>
      </div>

    </DashboardLayout>
    </>
    
  );
}

export default Dashboard;