const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        products: [
            {
                productId: {
                    type: String,
                },
                name: { type: String },
                desc: { type: String },
                img: { type: String },
                quantity: {
                    type: Number,
                    default: 1,
                },
                price: { type: Number },
                weight: { type: String },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
