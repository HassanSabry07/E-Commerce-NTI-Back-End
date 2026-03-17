const router = require('express').Router();
const ctrl = require('../controllers/siteSettings.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/', ctrl.getSettings);
router.put('/', protect, restrictTo('admin'), upload.single('aboutImageFile'), ctrl.updateSettings);

module.exports = router;
