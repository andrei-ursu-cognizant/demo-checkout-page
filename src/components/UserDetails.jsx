import React, { useState, useEffect } from "react";

export default function UserDetails({ data, onConfirm }) {
  const [firstName, setFirstName] = useState(data.firstName || "");
  const [lastName, setLastName] = useState(data.lastName || "");
  const [email, setEmail] = useState(data.email || "");
  const [phone, setPhone] = useState(data.phone || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setFirstName(data.firstName || "");
    setLastName(data.lastName || "");
    setEmail(data.email || "");
    setPhone(data.phone || "");
  }, [data]);

  function handleConfirm() {
    if (!firstName || !lastName || !email || !phone) {
      setError("Please fill all required fields");
      return;
    }
    setError("");
    onConfirm({ firstName, lastName, email, phone });
  }

  return (
    <div className="card">
      <h3>Your details</h3>
      <div className="form-row">
        <label>
          First name <span className="required">Required</span>
        </label>
        <input
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label>
          Last name <span className="required">Required</span>
        </label>
        <input value={lastName} onChange={(e) => setLastName(e.target.value)} />
      </div>
      <div className="form-row">
        <label>
          Email address <span className="required">Required</span>
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-row">
        <label>
          Phone number <span className="required">Required</span>
        </label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>
      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={handleConfirm}>
          CONFIRM DETAILS
        </button>
        <button className="btn secondary" style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
