const router = require('express').Router();
const Product = require('../models/Product');
const { verifyTokenAndAdmin } = require('../middleware/verifyToken');

// 1. CREATE PRODUCT (Admin Only)
router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. UPDATE PRODUCT (Admin Only)
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE PRODUCT (Admin Only)
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. GET PRODUCT (Public)
router.get('/find/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. GET ALL PRODUCTS (Public)
router.get('/', async (req, res) => {
  const qCategory = req.query.category;
  try {
    let products;
    if (qCategory) {
      products = await Product.find({
        category: {
          $in: [qCategory],
        },
      });
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 6. POST REVIEW (Verified Purchase Only)
const Review = require('../models/Review');
const Order = require('../models/Order');
const User = require('../models/User'); // Import User model
const { verifyToken } = require('../middleware/verifyToken');

router.post('/:id/reviews', verifyToken, async (req, res) => {
  try {
    const productId = req.params.id;
    const userId = req.user.id;

    // console.log(`[REVIEW CHECK] User: ${userId}, Product: ${productId}`);

    // 1. Verify Purchase (Robust Manual Check)
    const userOrders = await Order.find({ userId: userId });

    let hasPurchased = false;
    for (const order of userOrders) {
      if (order.products.some(p => p.productId && p.productId.toString() === productId)) {
        hasPurchased = true;
        break;
      }
    }

    // console.log(`[REVIEW CHECK] Manual Check Result: ${hasPurchased}`);

    if (!hasPurchased) {
      return res.status(403).json("You must purchase this product to leave a review.");
    }

    // 2. Check for Duplicate Review
    const alreadyReviewed = await Review.findOne({ userId, productId });
    if (alreadyReviewed) {
      return res.status(400).json("You have already reviewed this product.");
    }

    // 3. Get Username (Handle old tokens)
    let username = req.user.username;
    if (!username) {
      const currentUser = await User.findById(userId);
      username = currentUser ? currentUser.username : "User";
    }

    // 4. Create Review
    const newReview = new Review({
      userId,
      productId,
      username: username,
      rating: req.body.rating,
      comment: req.body.comment
    });

    const savedReview = await newReview.save();
    res.status(201).json(savedReview);

  } catch (err) {
    res.status(500).json(err);
  }
});

// 7. GET REVIEWS
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.id }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;