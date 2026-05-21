import { calculateDeliveryCost, getDeliveryPriceLabel } from "./deliveryCost";

describe("calculateDeliveryCost", () => {
  describe("Home delivery - Standard", () => {
    it("returns 3.50 when subtotal is less than 45", () => {
      const delivery = { type: "home", deliveryOpt: "standard" };
      expect(calculateDeliveryCost(delivery, 40)).toBe(3.5);
      expect(calculateDeliveryCost(delivery, 20)).toBe(3.5);
      expect(calculateDeliveryCost(delivery, 0)).toBe(3.5);
    });

    it("returns 0 (free) when subtotal is 45 or more", () => {
      const delivery = { type: "home", deliveryOpt: "standard" };
      expect(calculateDeliveryCost(delivery, 45)).toBe(0);
      expect(calculateDeliveryCost(delivery, 50)).toBe(0);
      expect(calculateDeliveryCost(delivery, 100)).toBe(0);
    });
  });

  describe("Home delivery - Next Day", () => {
    it("returns 5.95 for any subtotal", () => {
      const delivery = { type: "home", deliveryOpt: "next" };
      expect(calculateDeliveryCost(delivery, 10)).toBe(5.95);
      expect(calculateDeliveryCost(delivery, 45)).toBe(5.95);
      expect(calculateDeliveryCost(delivery, 100)).toBe(5.95);
    });
  });

  describe("Store delivery - Click & Collect", () => {
    it("returns 2.50 when subtotal is less than 20", () => {
      const delivery = { type: "store", deliveryOpt: null };
      expect(calculateDeliveryCost(delivery, 19)).toBe(2.5);
      expect(calculateDeliveryCost(delivery, 10)).toBe(2.5);
      expect(calculateDeliveryCost(delivery, 0)).toBe(2.5);
    });

    it("returns 0 (free) when subtotal is 20 or more", () => {
      const delivery = { type: "store", deliveryOpt: null };
      expect(calculateDeliveryCost(delivery, 20)).toBe(0);
      expect(calculateDeliveryCost(delivery, 50)).toBe(0);
      expect(calculateDeliveryCost(delivery, 100)).toBe(0);
    });
  });

  describe("Edge cases", () => {
    it("returns 0 when delivery is null", () => {
      expect(calculateDeliveryCost(null, 50)).toBe(0);
    });

    it("returns 0 when delivery.type is invalid", () => {
      const delivery = { type: "invalid", deliveryOpt: "standard" };
      expect(calculateDeliveryCost(delivery, 50)).toBe(0);
    });
  });
});

describe("getDeliveryPriceLabel", () => {
  it("shows correct standard delivery pricing", () => {
    expect(getDeliveryPriceLabel("home", "standard", 40)).toBe("£3.50");
    expect(getDeliveryPriceLabel("home", "standard", 45)).toBe("Free");
  });

  it("shows £5.95 for next day delivery", () => {
    expect(getDeliveryPriceLabel("home", "next", 10)).toBe("£5.95");
    expect(getDeliveryPriceLabel("home", "next", 100)).toBe("£5.95");
  });

  it("shows correct click and collect pricing", () => {
    expect(getDeliveryPriceLabel("store", "standard", 19)).toBe("£2.50");
    expect(getDeliveryPriceLabel("store", "standard", 20)).toBe("Free");
  });

  it("returns Free for invalid type", () => {
    expect(getDeliveryPriceLabel("invalid", "standard", 50)).toBe("Free");
  });
});
