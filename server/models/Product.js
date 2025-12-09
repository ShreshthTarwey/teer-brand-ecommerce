const mongoose = require('mongoose');

// Define the schema (Notice the variable name is 'productSchema')
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  img: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true, default: 50 },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// FIX: Use 'productSchema' (lowercase p) to match the variable above
module.exports = mongoose.models.Product || mongoose.model("Product", productSchema);