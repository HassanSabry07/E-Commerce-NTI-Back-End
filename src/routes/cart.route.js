const router = require('express').Router();
const cartController = require('../controllers/cart.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect);

router.get('/',                    cartController.getCart);
router.post('/',                   cartController.addToCart);
router.put('/:productId',          cartController.updateQuantity);
router.delete('/clear',            cartController.clearCart);
router.delete('/:productId',       cartController.removeFromCart);

module.exports = router;