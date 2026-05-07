import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Marketplace from "./pages/Marketplace";
import RetireHistory from "./pages/RetireHistory";

function App() {
  return (
    <BrowserRouter>
      <div style={{ fontFamily: "Arial", minHeight: "100vh", background: "#f0f4ff" }}>
        <nav style={{
          background: "#003087", color: "white",
          padding: "15px 30px", display: "flex",
          justifyContent: "space-between", alignItems: "center"
        }}>
          <span style={{ fontSize: "20px", fontWeight: "bold" }}>
            🏭 Adani Ports — Carbon Credit Marketplace
          </span>
          <div style={{ display: "flex", gap: "20px" }}>
            <a href="/" style={{ color: "white", textDecoration: "none" }}>Marketplace</a>
            <a href="/history" style={{ color: "white", textDecoration: "none" }}>My Offsets</a>
          </div>
        </nav>
        <div style={{ padding: "30px" }}>
          <Routes>
            <Route path="/"        element={<Marketplace />} />
            <Route path="/history" element={<RetireHistory />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;