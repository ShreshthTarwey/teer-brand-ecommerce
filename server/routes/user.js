const router = require("express").Router();
const User = require("../models/User");
const { verifyTokenAndAuthorization } = require("../middleware/verifyToken");
const bcrypt = require("bcryptjs"); // Import bcrypt for password hashing

// 1. UPDATE USER (Profile & Password)
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body,
            },
            { new: true }
        );
        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 2. ADD / UPDATE ADDRESS
router.put("/:id/address", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        const newAddress = {
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            pin: req.body.pin,
            isDefault: req.body.isDefault || false
        };

        // If new address is default, set others to false
        if (newAddress.isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(newAddress);
        const updatedUser = await user.save();

        res.status(200).json(updatedUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

// 3. DELETE ADDRESS
router.delete("/:id/address/:addressId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        user.addresses = user.addresses.filter(addr => addr._id.toString() !== req.params.addressId);
        await user.save();
        res.status(200).json("Address deleted");
    } catch (err) {
        res.status(500).json(err);
    }
});

// 4. GET USER (Admin Only)
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...others } = user._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
