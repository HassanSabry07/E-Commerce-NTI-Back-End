const router = require('express').Router();
const categoryController = require('../controllers/category.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/',     categoryController.getCategories);
router.get('/:id',  categoryController.getCategoryById);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, restrictTo('admin'));
router.post  ('/',    categoryController.addCategory);
router.put   ('/:id', categoryController.updateCategory);
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;