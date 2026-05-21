import "@testing-library/jest-dom";

// Mock fetch globally
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        {
          id: 1,
          name: "Product 1",
          price: 10,
          qty: 1,
          image: "image1.jpg",
          measurementUnit: "KG",
          netContents: 1,
        },
      ]),
  })
);

beforeEach(() => {
  fetch.mockClear();
});
