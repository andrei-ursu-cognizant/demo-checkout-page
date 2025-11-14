# Demo Checkout Page

This is a small demo React checkout application created to mirror a checkout UI. It stores state in localStorage and includes Jest/React Testing Library setup (no tests included yet).

How to run:

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm start
```

3. Run tests (none present yet):

```bash
npm test
```

Notes:

- The app uses webpack + babel and ships a small UI with 4-step checkout flow (details, delivery, gift card, payment).
- Data persists to localStorage under key `demo_checkout_v1`.
