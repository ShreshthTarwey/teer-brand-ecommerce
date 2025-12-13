const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");

// 1. REGISTER
router.post('/register', async (req, res) => {
  try {
    // Check if user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(400).json({ message: "Email already registered" });

    // Encrypt the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      // We don't let them set isAdmin manually for security
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    console.log("❌ REGISTER ERROR:", err);
    res.status(500).json(err);
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  try {
    // Find user
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "Wrong credentials!" });

    // Check password
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(401).json({ message: "Wrong credentials!" });

    // Create Access Token (The Digital ID Card)
    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: "3d" } // Token expires in 3 days
    );

    // Send everything EXCEPT the password
    const { password, ...others } = user._doc;
    res.status(200).json({ ...others, accessToken });

  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. FORGOT PASSWORD INIT (Returns Token to Frontend for EmailJS)
router.post("/forgot-password-init", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json("User not found");

    // Generate specific token (using crypto or simple random string)
    const token = crypto.randomBytes(20).toString('hex');

    // Save token to DB (valid for 1 hour)
    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    // Return token to frontend so it can send the email via EmailJS
    res.status(200).json({
      status: "ok",
      token: token,
      username: user.username
    });

  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. RESET PASSWORD FINISH
router.post("/reset-password-finish", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() } // Check if not expired
    });

    if (!user) return res.status(400).json("Token is invalid or has expired");

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json("Password reset successful!");

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;