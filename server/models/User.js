const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    addresses: [
      {
        street: String,
        city: String,
        state: String,
        pin: String,
        isDefault: { type: Boolean, default: false }
      }
    ]
  },
  { timestamps: true }
);

// Check if model exists to prevent overwrite error
module.exports = mongoose.models.User || mongoose.model("User", UserSchema);