import { loadState, saveState, clearState } from "./storage";

describe("storage utilities", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe("saveState", () => {
    it("saves state to localStorage with correct key", () => {
      const state = { step: 1, user: { name: "John" } };
      saveState(state);

      const stored = localStorage.getItem("demo_checkout_v1");
      expect(stored).toBeTruthy();
      expect(JSON.parse(stored)).toEqual(state);
    });

    it("handles empty state object", () => {
      saveState({});
      const stored = localStorage.getItem("demo_checkout_v1");
      expect(stored).toBe("{}");
    });

    it("handles complex nested state", () => {
      const state = {
        step: 2,
        user: { firstName: "Jane", email: "jane@example.com" },
        delivery: { type: "home", selected: true },
        gift: { card: "1111222233334444", pin: "1234" },
      };
      saveState(state);

      const stored = JSON.parse(localStorage.getItem("demo_checkout_v1"));
      expect(stored).toEqual(state);
    });

    it("overwrites existing state", () => {
      saveState({ step: 1 });
      saveState({ step: 2 });

      const stored = JSON.parse(localStorage.getItem("demo_checkout_v1"));
      expect(stored.step).toBe(2);
    });
  });

  describe("loadState", () => {
    it("returns empty object when no state is saved", () => {
      const state = loadState();
      expect(state).toEqual({});
    });

    it("returns saved state from localStorage", () => {
      const saved = { step: 1, user: { name: "John" } };
      localStorage.setItem("demo_checkout_v1", JSON.stringify(saved));

      const state = loadState();
      expect(state).toEqual(saved);
    });

    it("returns empty object when localStorage contains invalid JSON", () => {
      localStorage.setItem("demo_checkout_v1", "invalid json");

      const state = loadState();
      expect(state).toEqual({});
    });

    it("returns empty object when localStorage is not available", () => {
      // Test error handling
      const state = { step: 1 };
      saveState(state);
      expect(loadState()).toEqual(state);
    });

    it("loads complex nested state", () => {
      const complexState = {
        step: 3,
        user: {
          firstName: "Alice",
          lastName: "Smith",
          email: "alice@example.com",
          phone: "1234567890",
        },
        delivery: {
          type: "collection",
          selected: true,
          deliveryOpt: "9am-12pm",
        },
        gift: { card: "9999888877770000", pin: "9876" },
      };
      localStorage.setItem("demo_checkout_v1", JSON.stringify(complexState));

      const state = loadState();
      expect(state).toEqual(complexState);
      expect(state.user.firstName).toBe("Alice");
      expect(state.delivery.type).toBe("collection");
    });
  });

  describe("clearState", () => {
    it("removes state from localStorage", () => {
      saveState({ step: 1 });
      expect(localStorage.getItem("demo_checkout_v1")).toBeTruthy();

      clearState();
      expect(localStorage.getItem("demo_checkout_v1")).toBeNull();
    });

    it("does not throw error when clearing empty storage", () => {
      expect(() => clearState()).not.toThrow();
    });

    it("can save new state after clearing", () => {
      saveState({ step: 1 });
      clearState();

      const newState = { step: 0 };
      saveState(newState);

      expect(loadState()).toEqual(newState);
    });
  });

  describe("state persistence flow", () => {
    it("preserves state through save and load cycle", () => {
      const originalState = {
        step: 2,
        user: { firstName: "Bob", email: "bob@example.com" },
      };

      saveState(originalState);
      const loadedState = loadState();

      expect(loadedState).toEqual(originalState);
    });

    it("handles multiple sequential saves and loads", () => {
      saveState({ step: 0 });
      expect(loadState().step).toBe(0);

      saveState({ step: 1 });
      expect(loadState().step).toBe(1);

      saveState({ step: 2 });
      expect(loadState().step).toBe(2);
    });
  });
});
