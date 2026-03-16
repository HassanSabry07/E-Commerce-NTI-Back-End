const router = require('express').Router();
const heroController = require('../controllers/heroSettings.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.get('/', heroController.getHeroSettings);
router.put('/', protect, restrictTo('admin'), heroController.updateHeroSettings);

module.exports = router;
