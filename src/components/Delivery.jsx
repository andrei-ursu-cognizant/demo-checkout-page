import React, { useState, useMemo } from "react";

const HOME_SUGGESTIONS = [
  "10 Downing St, London, SW1A 2AA",
  "221B Baker St, London, NW1 6XE",
  "Unit 31, Snells Park, London, N18 2FD",
];

const STORE_SUGGESTIONS = [
  "Boots High St, London",
  "Boots Oxford St",
  "Boots Westfield Store",
];

export default function Delivery({ data, onSelect, onContinue }) {
  const [tab, setTab] = useState(data.type || "home");
  const [query, setQuery] = useState("");
  // Keep selections separate per tab so store selection is not shown when
  // the user switches to home delivery and vice-versa.
  const [selectedByTab, setSelectedByTab] = useState({
    home: data.type === "home" ? data.selected || null : null,
    store: data.type === "store" ? data.selected || null : null,
  });
  const [deliveryOpt, setDeliveryOpt] = useState(
    data.deliveryOpt || "standard"
  );
  const [pickupDate, setPickupDate] = useState(data.pickupDate || null);
  const [showModal, setShowModal] = useState(false);
  const [modalQuery, setModalQuery] = useState("");
  const [modalSelected, setModalSelected] = useState(null);

  const suggestions = useMemo(
    () => (tab === "home" ? HOME_SUGGESTIONS : STORE_SUGGESTIONS),
    [tab]
  );

  function handleSelect(addr) {
    setSelectedByTab((s) => ({ ...s, [tab]: addr }));
    onSelect({ type: tab, selected: addr, deliveryOpt, pickupDate });
  }

  function handleModalSelect(addr) {
    // when user selects inside modal, update local modalSelected
    setModalSelected(addr);
  }

  function confirmModalSelection() {
    const addr = modalSelected || modalQuery;
    if (!addr) return;
    setSelectedByTab((s) => ({ ...s, [tab]: addr }));
    onSelect({ type: tab, selected: addr, deliveryOpt, pickupDate });
    setShowModal(false);
  }

  function handleChangeAddress() {
    setSelectedByTab((s) => ({ ...s, [tab]: null }));
    setQuery("");
    onSelect({ type: tab, selected: null, deliveryOpt, pickupDate });
  }

  function applyDelivery() {
    onSelect({ type: tab, selected: selectedByTab[tab], deliveryOpt, pickupDate });
  }

  const upcomingDates = [
    new Date(Date.now() + 2 * 24 * 3600 * 1000),
    new Date(Date.now() + 3 * 24 * 3600 * 1000),
    new Date(Date.now() + 4 * 24 * 3600 * 1000),
  ];

  return (
    <div className="card">
      <h3>Delivery</h3>
      <div className="delivery-tabs">
        <div
          className={`tab ${tab === "home" ? "active" : ""}`}
          onClick={() => {
            setTab("home");
            // notify parent of active method and current selection for this tab
            onSelect({
              type: "home",
              selected: selectedByTab.home || null,
              deliveryOpt,
              pickupDate,
            });
          }}
        >
          Delivery
        </div>
        <div
          className={`tab ${tab === "store" ? "active" : ""}`}
          onClick={() => {
            setTab("store");
            onSelect({
              type: "store",
              selected: selectedByTab.store || null,
              deliveryOpt,
              pickupDate,
            });
          }}
        >
          Click & Collect
        </div>
      </div>

  {!selectedByTab[tab] && (
        <>
          <div className="form-row">
            <label>Postcode or city</label>
            {/* Clicking or focusing this input opens the modal for search */}
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter postcode or city"
              onFocus={() => {
                setModalQuery(selectedByTab[tab] || query || "");
                setModalSelected(null);
                setShowModal(true);
              }}
              readOnly={false}
            />
          </div>
        </>
      )}

      {/* Modal for searching addresses / stores */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            // click outside closes modal
            if (e.target.classList.contains("modal-overlay")) {
              setShowModal(false);
            }
          }}
        >
          <div className="modal">
            <div className="modal-header">
              <h4>{tab === "store" ? "Find a store" : "Find an address"}</h4>
              <button
                className="btn secondary"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="form-row">
              <label>Enter a postcode, shop name or town</label>
              <input
                value={modalQuery}
                onChange={(e) => setModalQuery(e.target.value)}
                placeholder="Enter post code or place"
                autoFocus
              />
            </div>

            <div className="suggestions">
              {modalQuery.length >= 3 &&
                suggestions.map((s) => (
                  <div
                    key={s}
                    className={`suggestion ${modalSelected === s ? "selected" : ""}`}
                    onClick={() => handleModalSelect(s)}
                    role="button"
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>{s}</div>
                      <div>
                        <input
                          type="radio"
                          name="modal-choice"
                          checked={modalSelected === s}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="small">4.16 miles</div>
                  </div>
                ))}
            </div>

            <div style={{ marginTop: 12, textAlign: "right" }}>
              <button className="btn secondary" onClick={() => setShowModal(false)} style={{ marginRight: 8 }}>
                Cancel
              </button>
              <button className="btn" onClick={confirmModalSelection}>
                Confirm {tab === "store" ? "store" : "address"}
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedByTab[tab] && (
        <div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 8 }}>
              {tab === "store" ? "Store address" : "Delivery address"}
            </label>
            <div className="address-display">{selectedByTab[tab]}</div>
            <div>
              <button className="btn secondary" onClick={handleChangeAddress}>
                Edit this address
              </button>
            </div>
          </div>

          {tab === "home" ? (
            <div>
              <div style={{ marginBottom: 16 }}>
                <label>Delivery method</label>
                <div style={{ marginTop: 8 }}>
                  <div style={{ marginBottom: 10 }}>
                    <label>
                      <input
                        type="radio"
                        name="d"
                        checked={deliveryOpt === "standard"}
                        onChange={() => setDeliveryOpt("standard")}
                      />{" "}
                      Standard Delivery
                    </label>
                    <div className="small" style={{ marginLeft: 20 }}>
                      You will receive your order on or before 14/11/2025 — Free
                    </div>
                  </div>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="d"
                        checked={deliveryOpt === "next"}
                        onChange={() => setDeliveryOpt("next")}
                      />{" "}
                      Next Day Delivery
                    </label>
                    <div className="small" style={{ marginLeft: 20 }}>
                      You will receive your order on or before 14/11/2025 —
                      £5.95
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ marginBottom: 16 }}>
              <label>Pick a collection date</label>
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginTop: 8,
                  flexWrap: "wrap",
                }}
              >
                {upcomingDates.map((d) => {
                  const label = d.toDateString();
                  return (
                    <label
                      key={label}
                      style={{
                        border:
                          pickupDate === label
                            ? "2px solid #0b57a4"
                            : "1px solid #ddd",
                        padding: 8,
                        borderRadius: 4,
                        cursor: "pointer",
                        flex: 1,
                        minWidth: 80,
                        textAlign: "center",
                      }}
                      onClick={() => setPickupDate(label)}
                    >
                      <input
                        type="radio"
                        name="pd"
                        checked={pickupDate === label}
                        readOnly
                        style={{ display: "none" }}
                      />
                      <div style={{ fontSize: 12 }}>{label}</div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* Selection is applied immediately on confirm in modal, no separate "Use this" button */}

          {selectedByTab[tab] && (
            <div style={{ marginTop: 12 }}>
              <button className="btn" onClick={onContinue}>
                Continue to gift card
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
