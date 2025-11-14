import React from "react";
import { PRODUCTS } from "../data/products";

export default function OrderSuccess({ details, orderInfo }) {
  const delivery = orderInfo?.delivery || {};
  const payment = orderInfo?.payment || {};

  return (
    <div className="card">
      <h2>Order success</h2>
      <p>
        Thank you {details?.firstName || "Customer"}, your order was placed
        successfully.
      </p>

      <h4>Items ordered</h4>
      <div>
        {PRODUCTS.map((p) => (
          <div key={p.id} className="product-card" style={{ padding: 10 }}>
            <img src={p.image} alt={p.name} className="product-image" />
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-qty">Qty: {p.qty}</div>
            </div>
            <div style={{ fontWeight: 600 }}>£{p.price.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <h4>Delivery</h4>
      <div className="address-display">
        <div>{delivery.type === "store" ? "Collection at:" : "Delivery to:"}</div>
        <div style={{ marginTop: 6 }}>{delivery.selected || "(no address)"}</div>
        {delivery.type === "store" && delivery.pickupDate && (
          <div className="small">Collection date: {delivery.pickupDate}</div>
        )}
        {delivery.type === "home" && (
          <div className="small">Method: {delivery.deliveryOpt || "standard"}</div>
        )}
      </div>

      <h4 style={{ marginTop: 12 }}>Payment</h4>
      <div className="card" style={{ padding: 12 }}>
        <div>Method: {payment.method || "(not specified)"}</div>
        {payment.last4 && <div>Card ending: •••• {payment.last4}</div>}
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn" onClick={() => window.location.reload()}>
          Back to shop
        </button>
      </div>
    </div>
  );
}
