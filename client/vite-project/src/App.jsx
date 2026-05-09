import './App.css'
import MainLayout from './components/layout/MainLayout'
import AIForecast from './pages/AIForecast'
import CandleChart from './pages/CandleChart'
import Dashboard from './pages/Dashboard'
import ProfitLoss from './pages/ProfitLoss'
import {  Route, Routes } from 'react-router-dom'

function App() {
  

  return (
    <>    
      <Routes>

      {/* MAIN LAYOUT */}
      <Route
        path="/"
        element={<MainLayout />}
      >

        {/* DASHBOARD */}
        <Route
          index
          element={<Dashboard />}
        />

        {/* PROFIT LOSS */}
        <Route
          path="profit-loss"
          element={<ProfitLoss />}
        />
        <Route
        path='/ai-forecast'
        element={<AIForecast/>}
        />
        <Route
  path="/candles"
  element={<CandleChart />}
/>

      </Route>

    </Routes>
    
    
  </>

  )
}

export default App
