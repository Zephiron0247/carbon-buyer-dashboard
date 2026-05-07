import React from "react";
import { BUYER_WALLET } from "../api/api";

export default function RetireHistory() {
  return (
    <div>
      <h1>My Carbon Offset History</h1>
      <p>Wallet: <code>{BUYER_WALLET}</code></p>
      <p style={{ color: "#555" }}>
        All retirements are permanently recorded on Sepolia blockchain.
        Search your wallet on{" "}
        <a
          href={`https://sepolia.etherscan.io/address/${BUYER_WALLET}`}
          target="_blank"
          rel="noreferrer"
        >
          Etherscan ↗
        </a>{" "}
        to see your complete offset history.
      </p>
    </div>
  );
}