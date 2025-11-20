import React, { useState } from "react";

function CardForm({ onPlaceOrder }) {
  const [number, setNumber] = useState("");
  const [expMonth, setExpMonth] = useState("");
  const [expYear, setExpYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");

  function handlePlace() {
    const n = number.replace(/\s+/g, "");
    if (
      n !== "9999888877770000" ||
      expMonth !== "12" ||
      expYear !== "26" ||
      cvv !== "123"
    ) {
      setError("Card details invalid");
      return;
    }
    setError("");
    // pass back minimal payment info
    onPlaceOrder({ method: "card", last4: n.slice(-4) });
  }

  return (
    <div>
      <div className="form-row">
        <label>Card number</label>
        <input
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          placeholder="9999 8888 7777 0000"
        />
      </div>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1 }} className="form-row">
          <label>Exp month</label>
          <input
            value={expMonth}
            onChange={(e) => setExpMonth(e.target.value)}
            placeholder="MM"
          />
        </div>
        <div style={{ flex: 1 }} className="form-row">
          <label>Exp year</label>
          <input
            value={expYear}
            onChange={(e) => setExpYear(e.target.value)}
            placeholder="YY"
          />
        </div>
        <div style={{ flex: 1 }} className="form-row">
          <label>CVV</label>
          <input
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            placeholder="123"
          />
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={handlePlace}>
          PLACE ORDER
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}

export default function Payment({ onOrderPlaced }) {
  const [method, setMethod] = useState("card");
  function handleOrderPlaced(paymentInfo) {
    // normalize payment info to include method
    const info = { method: method, ...paymentInfo };
    onOrderPlaced(info);
  }

  return (
    <div className="card">
      <h3>Payment</h3>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <button
          className={`btn ${method === "card" ? "" : "secondary"}`}
          onClick={() => setMethod("card")}
        >
          Pay with card
        </button>
        <button
          className={`btn ${method === "paypal" ? "" : "secondary"}`}
          onClick={() => setMethod("paypal")}
        >
          PayPal
        </button>
        <button
          className={`btn ${method === "apple" ? "" : "secondary"}`}
          onClick={() => setMethod("apple")}
        >
          Apple Pay
        </button>
      </div>

      <div>
        {method === "card" ? (
          <CardForm onPlaceOrder={handleOrderPlaced} />
        ) : (
          <div className="info-text">
            {method === "paypal"
              ? "PayPal payment method selected (demo)"
              : "Apple Pay payment method selected (demo)"}
            <div style={{ marginTop: 12 }}>
              <button
                className="btn"
                onClick={() => handleOrderPlaced({ method })}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
