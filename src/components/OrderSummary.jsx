import React, { useState } from "react";
import { PRODUCTS } from "../data/products";

export default function OrderSummary({ giftCard, offer, delivery }) {
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [appliedOffer, setAppliedOffer] = useState(offer || null);

  const subtotal = PRODUCTS.reduce((s, p) => s + p.price * p.qty, 0);

  function apply() {
    if (code === "DEMO123") {
      setAppliedOffer({ code, value: 3 });
      setMsg("Offer applied: £3");
    } else {
      setMsg("Invalid offer code");
      setAppliedOffer(null);
    }
  }

  const giftValue = giftCard ? giftCard.value || 0 : 0;
  const offerValue = appliedOffer ? appliedOffer.value : 0;
  const deliveryCost = delivery
    ? delivery.type === "home"
      ? delivery.deliveryOpt === "next"
        ? 5.95
        : 0
      : 0
    : 0;

  const total = Math.max(0, subtotal - giftValue - offerValue + deliveryCost);

  // Convert KG->g or L->ml (lowercase) and return converted unit and netContents
  const convertUnit = (product) => {
    const { measurementUnit, netContents } = product;

    if (measurementUnit === "KG") {
      return { unit: "g", contents: netContents * 1000 };
    } else if (measurementUnit === "L") {
      return { unit: "ml", contents: netContents * 1000 };
    }
    return { unit: measurementUnit, contents: netContents };
  };

  const getProductContents = (product) => {
    // For mixed bundles (isSameItemBundle: false), don't apply any conversion
    if (product.isBundle && !product.isSameItemBundle) {
      return `${product.netContents} ${product.measurementUnit} | £${(
        product.price / product.netContents
      ).toFixed(2)} per ${product.measurementUnit}`;
    }

    const converted = convertUnit(product);

    // For same-item bundles with netContents <= 5g/5ml, hide price per unit
    if (product.isSameItemBundle && converted.contents <= 5) {
      return `${converted.contents} ${converted.unit}`;
    }

    // Display converted unit and value on left, use original netContents for price per unit on right
    return `${converted.contents} ${converted.unit} | £${(
      product.price / product.netContents
    ).toFixed(2)} per ${product.measurementUnit}`;
  };

  return (
    <div className="card">
      <h3>Order summary</h3>
      <div style={{ marginBottom: 16 }}>
        {PRODUCTS.map((p) => (
          <div key={p.id} className="product-card">
            <img
              src={p.image}
              alt={p.name}
              className="product-image"
              onError={(e) => {
                // show a lightweight inline placeholder when image fails
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "data:image/svg+xml;utf8," +
                  encodeURIComponent(
                    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='120'><rect width='100%' height='100%' fill='%23eee'/><text x='50%' y='50%' fill='%23999' font-size='12' font-family='Arial' dominant-baseline='middle' text-anchor='middle'>No image</text></svg>`
                  );
              }}
            />
            <div className="product-info">
              <div className="product-name">{p.name}</div>
              <div className="product-qty">Qty: {p.qty}</div>
              <div className="product-price">£{p.price.toFixed(2)}</div>
              <div className="product-contents">{getProductContents(p)}</div>
            </div>
          </div>
        ))}
      </div>

      <hr />
      <div className="form-row">
        <label>Offer code</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter code"
          />
          <button className="btn" onClick={apply}>
            APPLY
          </button>
        </div>
        {msg && (
          <div className={msg.includes("Invalid") ? "error" : "success"}>
            {msg}
          </div>
        )}
      </div>

      <hr />
      <div className="summary-row">
        <div>Subtotal</div>
        <div>£{subtotal.toFixed(2)}</div>
      </div>
      {offerValue > 0 && (
        <div className="summary-row">
          <div>Offer ({appliedOffer.code})</div>
          <div style={{ color: "#d32f2f" }}>-£{offerValue.toFixed(2)}</div>
        </div>
      )}
      {giftValue > 0 && (
        <div className="summary-row">
          <div>Gift card</div>
          <div style={{ color: "#d32f2f" }}>-£{giftValue.toFixed(2)}</div>
        </div>
      )}
      <div className="summary-row">
        <div>Delivery</div>
        <div>{deliveryCost === 0 ? "Free" : `£${deliveryCost.toFixed(2)}`}</div>
      </div>
      <hr />
      <div className="summary-row total">
        <div>Total</div>
        <div>£{total.toFixed(2)}</div>
      </div>
    </div>
  );
}
