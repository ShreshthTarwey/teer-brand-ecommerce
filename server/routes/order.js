const router = require("express").Router();
const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("../middleware/verifyToken");

//Paginate server resopnse for mongodb


// 1. CREATE ORDER (Any logged in user can create)
router.post("/", verifyToken, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();

    // DECREMENT STOCK
    for (const item of req.body.products) {
      if (item.productId) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    res.status(200).json(savedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. GET USER ORDERS (User can see their own orders)
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate("products.productId");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

const Product = require("../models/Product"); // Moved to top

// 5. CANCEL ORDER (User/Admin) - Re-stocks items
router.put("/:id/cancel", verifyToken, async (req, res) => {
  try {
    console.log(`Attempting checking to cancel order: ${req.params.id} for user: ${req.user.id}`);

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json("Order not found");

    console.log("Order found:", order._id);

    // CHECK: Only Admin OR Order Owner can cancel
    if (!req.user.isAdmin && order.userId.toString() !== req.user.id) {
      console.log("Ownership check failed");
      return res.status(403).json("You are not allowed to cancel this order");
    }

    if (order.status !== "pending") {
      return res.status(400).json("Only pending orders can be cancelled.");
    }

    // 1. Update Order Status
    order.status = "cancelled";
    const updatedOrder = await order.save();
    console.log("Order status updated to cancelled");

    // 2. Restock Products
    for (const item of order.products) {
      if (item.productId) {
        console.log(`Restocking product: ${item.productId} qty: ${item.quantity}`);
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: item.quantity }
        });
      } else {
        console.log("Skipping restock for item with missing productId");
      }
    }

    res.status(200).json({ message: "Order cancelled and items restocked", order: updatedOrder });

  } catch (err) {
    console.error("CANCEL ERROR:", err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
});

// 4. UPDATE ORDER (Admin Only)
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET ALL ORDERS (Admin Only - for your Dashboard later)
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find().populate("userId", "username email");
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;