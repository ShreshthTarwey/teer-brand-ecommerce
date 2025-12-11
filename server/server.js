// const express = require('express');
// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const cors = require('cors');

// dotenv.config();

// const app = express();

// // Middleware
// app.use(express.json());
// app.use(cors()); // Crucial for Vercel <-> Render communication

// // Database Connection
// mongoose.connect(process.env.MONGO_URI)
//   .then(() => console.log("DB Connection Successful!"))
//   .catch((err) => console.log(err));

// // Test Route
// app.get('/api/test', (req, res) => {
//   res.send("Teer Brand API is Running!");
// });

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Backend server is running on port ${PORT}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load env variables
dotenv.config();

// Initialize App
const app = express();

// Middleware
app.use(express.json()); // Parse JSON bodies
app.use(cors()); // Allow requests from React (important for Vercel deployment)

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connection Successful!"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// Test Route
app.get('/', (req, res) => {
  res.send("Teer Brand API is Running...");
});

// Import Routes 

// Use Routes
const authRoute = require('./routes/auth');
const productRoute = require('./routes/products');
app.use('/api/auth', authRoute);
app.use('/api/products', productRoute);

const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");
const paymentRoute = require("./routes/payment");

app.use("/api/orders", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/payment", paymentRoute);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});