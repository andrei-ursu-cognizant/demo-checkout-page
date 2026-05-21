/**
 * Calculate delivery cost based on delivery type, option, and subtotal
 * 
 * @param {Object} delivery - Delivery object with type and deliveryOpt
 * @param {number} subtotal - Order subtotal before delivery
 * @returns {number} Delivery cost in pounds
 */
export function calculateDeliveryCost(delivery, subtotal) {
  if (!delivery || !delivery.type) {
    return 0;
  }

  const { type, deliveryOpt } = delivery;

  if (type === "home") {
    if (deliveryOpt === "next") {
      return 5.95; // Next day delivery always £5.95
    }
    // Standard delivery
    return subtotal >= 45 ? 0 : 3.5;
  }

  if (type === "store") {
    // Click & Collect
    return subtotal >= 20 ? 0 : 2.5;
  }

  return 0;
}

/**
 * Get delivery cost display text for Delivery component
 * @param {string} type - "home" or "store"
 * @param {string} deliveryOpt - "standard" or "next"
 * @param {number} subtotal - Order subtotal
 * @returns {string} Display text for delivery option
 */
export function getDeliveryPriceLabel(type, deliveryOpt, subtotal) {
  if (type === "home") {
    if (deliveryOpt === "next") {
      return "£5.95";
    }
    // Standard
    const cost = subtotal >= 45 ? 0 : 3.5;
    return cost === 0 ? "Free" : `£${cost.toFixed(2)}`;
  }

  if (type === "store") {
    const cost = subtotal >= 20 ? 0 : 2.5;
    return cost === 0 ? "Free" : `£${cost.toFixed(2)}`;
  }

  return "Free";
}
