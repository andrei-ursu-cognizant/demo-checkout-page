import React from "react";

// Stepper now accepts a `panels` prop: an array of React nodes to render
// inside each collapsible step. Header click sets the active step and
// ensures the panel is open. The expand toggle only toggles expansion
// and doesn't trigger navigation (stopPropagation is used).
export default function Stepper({
  step,
  setStep,
  expandedSteps,
  setExpandedSteps,
  panels = [],
}) {
  const labels = ["Your details", "Delivery", "Gift card", "Payment"];

  function toggleStep(i) {
    if (expandedSteps.includes(i)) {
      setExpandedSteps(expandedSteps.filter((s) => s !== i));
    } else {
      setExpandedSteps([...expandedSteps, i]);
    }
  }

  function goToStep(i) {
    setStep(i);
    if (!expandedSteps.includes(i)) {
      setExpandedSteps([...expandedSteps, i]);
    }
  }

  return (
    <div className="stepper-vertical">
      {labels.map((l, i) => (
        <div key={l} className="stepper-item">
          <div
            className={`stepper-header ${i === step ? "active" : ""} ${
              i < step ? "completed" : ""
            }`}
            onClick={() => goToStep(i)}
          >
            <div className="stepper-circle">{i < step ? "✓" : i + 1}</div>
            <div className="stepper-label">{l}</div>

            {/* expand toggle should not trigger header click */}
            <div
              className="stepper-expand"
              onClick={(e) => {
                e.stopPropagation();
                toggleStep(i);
              }}
            >
              {expandedSteps.includes(i) ? "−" : "+"}
            </div>
          </div>

          {expandedSteps.includes(i) && (
            <div className="stepper-content">{panels[i] || null}</div>
          )}
        </div>
      ))}
    </div>
  );
}
