const router = require('express').Router();
const orderController = require('../controllers/order.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect);
router.get   ('/my',           orderController.getMyOrders);
router.post  ('/',             orderController.createOrder);
router.patch ('/:id/cancel',   orderController.cancelOrder);
router.patch ('/:id/me',       orderController.updateMyOrder);   // ← جديد
router.delete('/:id/me',       orderController.deleteMyOrder);

router.use(restrictTo('admin'));
router.get   ('/',             orderController.getOrders);
router.patch ('/:id/status',   orderController.updateStatus);
router.delete('/:id',          orderController.deleteOrder);

module.exports = router;