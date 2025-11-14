import React, { useState } from "react";

export default function GiftCard({ applied, onApply, onContinue }) {
  const [card, setCard] = useState("");
  const [pin, setPin] = useState("");
  const [msg, setMsg] = useState("");

  function normalize(v) {
    return v.replace(/\s+/g, "");
  }

  function handleAdd() {
    const n = normalize(card);
    const accepted = n === "1111222233334444" && pin === "1234";
    if (accepted) {
      onApply({ number: card, pin, value: 5 });
      setMsg("Gift card applied: £5");
    } else {
      setMsg("Invalid gift card");
    }
  }

  return (
    <div className="card">
      <h3>Gift Card</h3>
      <div className="form-row">
        <label>Card number</label>
        <input
          value={card}
          onChange={(e) => setCard(e.target.value)}
          placeholder="1111 2222 3333 4444"
        />
      </div>
      <div className="form-row">
        <label>PIN Code</label>
        <input value={pin} onChange={(e) => setPin(e.target.value)} />
      </div>
      <div>
        <button className="btn" onClick={handleAdd}>
          ADD
        </button>
      </div>
      {applied && <div className="success">Applied: £{applied.value}</div>}
      {msg && (
        <div className={msg.includes("Invalid") ? "error" : "success"}>
          {msg}
        </div>
      )}
      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={onContinue}>
          Continue to payment
        </button>
      </div>
    </div>
  );
}
