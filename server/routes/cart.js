const router = require("express").Router();
const Cart = require("../models/Cart");
// const { verifyToken } = require("./verifyToken"); // Assuming you have middleware, but for now we'll pass userId in body or generic

// CREATE or UPADTE CART
router.post("/", async (req, res) => {
    const { userId, product, type } = req.body; // type: 'add', 'remove', 'update', 'merge'

    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            // Create new cart
            const newCart = new Cart({
                userId,
                products: product ? [{ ...product, quantity: product.quantity || 1 }] : [],
            });
            const savedCart = await newCart.save();
            return res.status(200).json(savedCart);
        }

        // Update existing cart
        if (type === "merge") {
            // Incoming product is actually an array of products from local storage
            const localProducts = product; // Expecting array
            localProducts.forEach(localItem => {
                const existingItemIndex = cart.products.findIndex(p => p.productId === localItem.id);
                if (existingItemIndex > -1) {
                    // If item exists, we could sum quantities or just overwrite. Let's sum.
                    // cart.products[existingItemIndex].quantity += localItem.quantity; 
                    // Creating a simplified merge: if exists, do nothing (server wins), else push
                } else {
                    cart.products.push({
                        productId: localItem.id,
                        name: localItem.name,
                        img: localItem.img,
                        price: localItem.price,
                        quantity: localItem.quantity,
                        weight: localItem.weight
                    });
                }
            });
        } else if (product) {
            const itemIndex = cart.products.findIndex((p) => p.productId === product.id);

            if (itemIndex > -1) {
                // Product exists in cart, update quantity
                if (type === 'update_qty') {
                    cart.products[itemIndex].quantity = product.quantity;
                } else {
                    cart.products[itemIndex].quantity += 1;
                }
            } else {
                // Product does not exist, push new item
                cart.products.push({
                    productId: product.id,
                    name: product.name,
                    img: product.img,
                    price: product.price,
                    quantity: 1,
                    weight: product.weight
                });
            }
        }

        const updatedCart = await cart.save();
        res.status(200).json(updatedCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// GET USER CART
router.get("/find/:userId", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.userId });
        res.status(200).json(cart);
    } catch (err) {
        res.status(500).json(err);
    }
});

// DELETE ITEM FROM CART (Update quantity to 0 effectively or filter out)
router.post("/remove", async (req, res) => {
    const { userId, productId } = req.body;
    try {
        const cart = await Cart.findOne({ userId });
        if (cart) {
            cart.products = cart.products.filter(p => p.productId !== productId);
            await cart.save();
            res.status(200).json(cart);
        } else {
            res.status(404).json("Cart not found");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

// CLEAR CART
router.post("/clear", async (req, res) => {
    const { userId } = req.body;
    try {
        await Cart.findOneAndDelete({ userId });
        res.status(200).json("Cart cleared");
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports = router;
