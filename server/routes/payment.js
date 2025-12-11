const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");
const Order = require("../models/Order");

// INITIALIZE RAZORPAY - Removed global instance to prevent startup crash if keys are missing
// const razorpay = new Razorpay({ ... });

// 1. CREATE ORDER (Initiate Payment)
router.post("/orders", async (req, res) => {
    try {
        const instance = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });

        const options = {
            amount: req.body.amount * 100, // Amount in smallest currency unit (paise)
            currency: "INR",
            receipt: crypto.randomBytes(10).toString("hex"),
        };

        instance.orders.create(options, (error, order) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: "Something Went Wrong!" });
            }
            res.status(200).json({ data: order });
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

// 2. VERIFY PAYMENT (After Frontend Success)
router.post("/verify", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

        const sign = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest("hex");

        if (razorpay_signature === expectedSign) {
            // PAYMENT SUCCESSFUL - HERE YOU CAN UPDATE ORDER STATUS IN DB IF NEEDED
            // Make sure to pass orderId from frontend if you want to update specific order,
            // or handle logic here. For now returning success.
            return res.status(200).json({ message: "Payment Verified Successfully" });
        } else {
            return res.status(400).json({ message: "Invalid Signature Sent!" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error!" });
    }
});

module.exports = router;
