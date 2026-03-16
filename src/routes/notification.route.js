const router = require('express').Router();
const notifController = require('../controllers/notification.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.use(protect, restrictTo('admin'));
router.get('/',            notifController.getNotifications);
router.patch('/:id/read',  notifController.markOneRead);
router.delete('/:id',      notifController.deleteNotification);

module.exports = router;
