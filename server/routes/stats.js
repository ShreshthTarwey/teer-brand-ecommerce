const router = require("express").Router();
const Order = require("../models/Order");
const Product = require("../models/Product");
const { verifyTokenAndAdmin } = require("../middleware/verifyToken");

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        // 1. BASIC COUNTS
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();

        // 2. TOTAL REVENUE (Exclude Cancelled)
        const revenueAgg = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        // 3. SALES OVER TIME (Last 7 Days) - for Line Chart
        const date = new Date();
        const last7Days = new Date(date.setDate(date.getDate() - 7));

        const salesStats = await Order.aggregate([
            { $match: { createdAt: { $gte: last7Days }, status: { $ne: "cancelled" } } },
            {
                $project: {
                    day: { $dateToString: { format: "%d-%m", date: "$createdAt" } }, // Day-Month
                    amount: "$amount"
                }
            },
            {
                $group: {
                    _id: "$day",
                    sales: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } } // Sort by Date
        ]);

        // 4. TOP PRODUCTS (By Quantity Sold) - Detailed Insight
        // This is tricky because Order stores products in an array. We need to unwind.
        const topProducts = await Order.aggregate([
            { $match: { status: { $ne: "cancelled" } } },
            { $unwind: "$products" },
            // FIX: Cast string IDs to ObjectId for lookup compatibility with older data
            {
                $addFields: {
                    "products.productId": { $toObjectId: "$products.productId" }
                }
            },
            {
                $group: {
                    _id: "$products.productId",
                    totalSold: { $sum: "$products.quantity" }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            // JOIN with Products collection to get Name
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            {
                $project: {
                    name: { $ifNull: [{ $arrayElemAt: ["$productInfo.name", 0] }, "Unknown Product"] },
                    totalSold: 1
                }
            },
            {
                $match: { name: { $ne: "Unknown Product" } }
            }
        ]);


        res.status(200).json({
            totalProducts,
            totalOrders,
            totalRevenue,
            salesStats,
            topProducts
        });

    } catch (err) {
        console.error("STATS ERROR:", err);
        res.status(500).json(err);
    }
});

module.exports = router;
