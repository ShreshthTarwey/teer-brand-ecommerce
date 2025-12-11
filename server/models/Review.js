const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
    {
        productId: { type: String, required: true },
        userId: { type: String, required: true },
        username: { type: String, default: "Anonymous" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
