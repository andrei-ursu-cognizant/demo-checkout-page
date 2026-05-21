import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, "data");
const productsFile = path.join(dataDir, "products.json");
const ordersFile = path.join(dataDir, "orders.json");

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || "http://localhost:3000" }));
app.use(express.json());

// Helper functions
const readProducts = () => {
  try {
    const data = fs.readFileSync(productsFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading products.json:", error);
    return [];
  }
};

const readOrders = () => {
  try {
    const data = fs.readFileSync(ordersFile, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading orders.json:", error);
    return [];
  }
};

const writeOrders = (orders) => {
  try {
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing orders.json:", error);
  }
};

// Routes
app.get("/api/products", (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post("/api/orders", (req, res) => {
  try {
    const { user, delivery, gift, payment } = req.body;

    // Basic validation
    if (!user?.firstName || !delivery?.selected) {
      return res.status(400).json({
        error: "Missing required fields: user.firstName and delivery.selected",
      });
    }

    // Create order object
    const order = {
      id: `order_${Date.now()}`,
      timestamp: new Date().toISOString(),
      user,
      delivery,
      gift,
      payment,
    };

    // Append to orders
    const orders = readOrders();
    orders.push(order);
    writeOrders(orders);

    res.status(201).json({
      success: true,
      orderId: order.id,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Error processing order:", error);
    res.status(500).json({ error: "Failed to process order" });
  }
});

// Seed endpoint (optional)
app.get("/api/seed", (req, res) => {
  try {
    const seedData = [
      {
        id: "p1",
        name: "Tom Ford Black Orchid Eau de Parfum Spray 100ml",
        price: 86.25,
        qty: 1,
        image: "https://boots.scene7.com/is/image/Boots/10099324?op_sharpen=1",
        measurementUnit: "L",
        netContents: 0.1,
        isBundle: false,
        isSameItemBundle: false,
      },
      {
        id: "p2",
        name: "YSL Rouge Volupté Candy Glaze Lipstick",
        price: 28.75,
        qty: 1,
        image: "https://boots.scene7.com/is/image/Boots/10342780?op_sharpen=1",
        measurementUnit: "KG",
        netContents: 0.08,
        isBundle: false,
        isSameItemBundle: false,
      },
      {
        id: "p3",
        name: "Pack of 3 Boots double faced oval cotton wool pads 50",
        price: 3.58,
        qty: 1,
        image: "https://boots.scene7.com/is/image/Boots/10283515?op_sharpen=1",
        measurementUnit: "KG",
        netContents: 0.003,
        isBundle: true,
        isSameItemBundle: true,
      },
      {
        id: "p4",
        name: "L'Oreal Men Expert Toiletries Bundle",
        price: 12.85,
        qty: 1,
        image: "https://boots.scene7.com/is/image/Boots/10367864?op_sharpen=1",
        measurementUnit: "L",
        netContents: 1.35,
        isBundle: true,
        isSameItemBundle: false,
      },
    ];

    fs.writeFileSync(productsFile, JSON.stringify(seedData, null, 2), "utf-8");
    res.json({ success: true, message: "Products seeded successfully" });
  } catch (error) {
    console.error("Error seeding products:", error);
    res.status(500).json({ error: "Failed to seed products" });
  }
});

// Error handling middleware
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});
