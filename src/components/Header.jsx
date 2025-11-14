import React from "react";

export default function Header() {
  return (
    // header should span full width of the app area; layout handled in App
    <div
      className="header"
      style={{ width: "80%", margin: "0 auto", padding: "20px" }}
    >
      <h1>Checkout</h1>
    </div>
  );
}
