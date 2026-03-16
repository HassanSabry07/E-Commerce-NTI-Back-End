const router = require("express").Router();
const wishlistController = require("../controllers/wishlist.controller");
const { protect } = require("../middlewares/auth.middleware");

router.use(protect);

router.get("/", wishlistController.getWishlist);
router.post("/", wishlistController.addToWishlist);
router.delete("/clear", wishlistController.clearWishlist);
router.post("/:id/move-to-cart", wishlistController.moveToCart);
router.delete("/:id", wishlistController.removeFromWishlist);

module.exports = router;
