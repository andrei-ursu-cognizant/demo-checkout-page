import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Stepper from "./components/Stepper";
import UserDetails from "./components/UserDetails";
import Delivery from "./components/Delivery";
import GiftCard from "./components/GiftCard";
import Payment from "./components/Payment";
import OrderSummary from "./components/OrderSummary";
import OrderSuccess from "./components/OrderSuccess";
import { loadState, saveState, clearState } from "./utils/storage";

export default function App() {
  const saved = loadState();
  const [step, setStep] = useState(saved.step || 0);
  const [user, setUser] = useState(saved.user || {});
  const [delivery, setDelivery] = useState(saved.delivery || null);
  const [gift, setGift] = useState(saved.gift || null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderInfo, setOrderInfo] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState([0]);

  useEffect(() => {
    saveState({ step, user, delivery, gift });
  }, [step, user, delivery, gift]);

  function handleConfirmDetails(d) {
    setUser(d);
    goToStep(1);
  }

  function handleSelectDelivery(d) {
    setDelivery(d);
  }

  function handleApplyGift(g) {
    setGift(g);
  }

  // Navigate to a step triggered by an action button: collapse the `from` panel
  // (defaults to current `step`) and ensure the `to` panel is expanded.
  function goToStep(to, from = step) {
    setStep(to);
    setExpandedSteps((prev) => {
      const withoutFrom = prev.filter((s) => s !== from);
      if (!withoutFrom.includes(to)) return [...withoutFrom, to];
      return withoutFrom;
    });
  }

  function handlePlaceOrder(paymentInfo) {
    // Quick sanity: require user and delivery
    if (
      !user.firstName ||
      !delivery ||
      (!delivery.selected && delivery !== null)
    ) {
      alert("Please finish details and delivery before placing order");
      return;
    }
    setOrderInfo({ user, delivery, gift, payment: paymentInfo });
    setOrderPlaced(true);
    // clearState(); // keep state for demo
  }

  if (orderPlaced) {
    return (
      <div>
        <Header />
        <div className="container">
          <div className="main">
            <OrderSuccess details={user} orderInfo={orderInfo} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="container">
        <div className="main">
          <Stepper
            step={step}
            setStep={setStep}
            expandedSteps={expandedSteps}
            setExpandedSteps={setExpandedSteps}
            panels={[
              <UserDetails
                data={user}
                onConfirm={handleConfirmDetails}
                key="step-0"
              />,
              <Delivery
                data={delivery || { type: "home" }}
                onSelect={handleSelectDelivery}
                onContinue={() => goToStep(2)}
                key="step-1"
              />,
              <GiftCard
                applied={gift}
                onApply={(g) => {
                  handleApplyGift(g);
                  goToStep(3);
                }}
                onContinue={() => goToStep(3)}
                key="step-2"
              />,
              <Payment onOrderPlaced={handlePlaceOrder} key="step-3" />,
            ]}
          />
        </div>

        <div className="sidebar">
          <OrderSummary giftCard={gift} offer={null} delivery={delivery} />
        </div>
      </div>
    </div>
  );
}
