const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: { type: String, ref: 'User', required: true },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    shippingFee: { type: Number, default: 0 },
    amount: { type: Number, required: true },
    address: { type: Object, required: true }, // Stores street, city, pin, etc.
    status: { type: String, default: "pending" }, // pending, approved, delivered
    paymentStatus: { type: String, default: "Pending" },
    paymentId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", OrderSchema);