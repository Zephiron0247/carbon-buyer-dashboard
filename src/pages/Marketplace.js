import React, { useEffect, useState } from "react";
import { getAvailableCredits, retireCredits, BUYER_WALLET } from "../api/api";

export default function Marketplace() {
  const [credits, setCredits]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [retiring, setRetiring]     = useState(null);
  const [privateKey, setPrivateKey] = useState("");
  const [amount, setAmount]         = useState(10);
  const [result, setResult]         = useState(null);

  useEffect(() => {
    getAvailableCredits()
      .then(res => setCredits(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRetire = async (credit) => {
    if (!privateKey) {
      alert("Enter your private key to sign the retirement transaction");
      return;
    }
    if (amount <= 0 || amount > credit.active_credits) {
      alert(`Amount must be between 1 and ${credit.active_credits}`);
      return;
    }

    try {
      setResult(null);
      const res = await retireCredits({
        project_id       : credit.project_id,
        verification_id  : credit.verification_id,
        amount           : amount,
        buyer_wallet     : BUYER_WALLET,
        buyer_private_key: privateKey
      });
      setResult(res.data);
      setRetiring(null);
      setPrivateKey("");
      // Re-fetch credits after successful retirement to show updated balance
      const res2 = await getAvailableCredits();
      setCredits(res2.data);
      alert(`✅ ${amount} credits retired!\nTX: ${res.data.tx_hash}`);
    } catch (err) {
      alert("Retire failed: " + (err.response?.data?.detail || err.message));
    }
  };

  if (loading) return <h2>Loading marketplace...</h2>;

  return (
    <div>
      <h1>Available Carbon Credits</h1>
      <p style={{ color: "#555" }}>
        Buying as: <code>{BUYER_WALLET}</code>
      </p>

      {result && (
        <div style={{
          background: "#d4edda", border: "1px solid #c3e6cb",
          borderRadius: "10px", padding: "15px", marginBottom: "20px"
        }}>
          <b>✅ Retirement Successful</b>
          <p>Amount: {result.amount_retired} tCO₂</p>
          <p>
            <a href={result.etherscan} target="_blank" rel="noreferrer">
              View on Etherscan ↗
            </a>
          </p>
        </div>
      )}

      {credits.length === 0 ? (
        <p>No credits available for purchase right now.</p>
      ) : (
        credits.map(credit => (
          <div key={credit.project_id} style={{
            background: "white", border: "1px solid #ddd",
            borderRadius: "12px", padding: "25px", marginBottom: "20px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
              <div>
                <h2 style={{ margin: "0 0 8px 0", color: "#003087" }}>
                  {credit.company_name}
                </h2>
                <p style={{ margin: "4px 0", color: "#555" }}>
                  📍 Area: {credit.area_hectares} ha &nbsp;|&nbsp;
                  🌱 Planted: {credit.plantation_date}
                </p>
                <p style={{ margin: "4px 0", color: "#555" }}>
                  📊 NDVI: {credit.ndvi_current} &nbsp;|&nbsp;
                  🌳 Tree Cover: {credit.tree_cover_pct}% &nbsp;|&nbsp;
                  ✅ Confidence: {credit.confidence_score}/100
                </p>
                <p style={{ margin: "4px 0" }}>
                  <a href={credit.etherscan} target="_blank" rel="noreferrer"
                    style={{ color: "#003087", fontSize: "13px" }}>
                    🔗 Verified on Blockchain ↗
                  </a>
                </p>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "36px", fontWeight: "bold", color: "#1a472a" }}>
                  {credit.active_credits}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>tCO₂ available</div>
              </div>
            </div>

            {/* Retire form */}
            {retiring === credit.project_id ? (
              <div style={{
                marginTop: "15px", padding: "15px",
                background: "#f8f9fa", borderRadius: "8px"
              }}>
                <p><b>Retire Credits from this project</b></p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                  <input
                    type="number"
                    value={amount}
                    onChange={e => setAmount(parseInt(e.target.value))}
                    min="1"
                    max={credit.active_credits}
                    placeholder="Amount"
                    style={{ padding: "8px", width: "100px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                  <input
                    type="password"
                    value={privateKey}
                    onChange={e => setPrivateKey(e.target.value)}
                    placeholder="Your private key (Account 3)"
                    style={{ padding: "8px", width: "280px", borderRadius: "6px", border: "1px solid #ccc" }}
                  />
                  <button
                    onClick={() => handleRetire(credit)}
                    style={{
                      padding: "8px 20px", background: "#003087",
                      color: "white", border: "none", borderRadius: "6px", cursor: "pointer"
                    }}
                  >
                    Confirm Retire
                  </button>
                  <button
                    onClick={() => { setRetiring(null); setPrivateKey(""); }}
                    style={{
                      padding: "8px 20px", background: "#eee",
                      border: "none", borderRadius: "6px", cursor: "pointer"
                    }}
                  >
                    Cancel
                  </button>
                </div>
                <p style={{ fontSize: "12px", color: "#888", marginTop: "8px" }}>
                  ⚠️ Private key is used locally to sign the transaction and never stored.
                </p>
              </div>
            ) : (
              <button
                onClick={() => setRetiring(credit.project_id)}
                style={{
                  marginTop: "15px", padding: "10px 25px",
                  background: "#1a472a", color: "white",
                  border: "none", borderRadius: "8px", cursor: "pointer",
                  fontSize: "15px"
                }}
              >
                Retire Credits to Offset Emissions
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}