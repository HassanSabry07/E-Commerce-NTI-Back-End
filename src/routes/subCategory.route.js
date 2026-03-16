const router = require('express').Router();
const subCategoryController = require('../controllers/subCategory.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

// ─── Public ───────────────────────────────────────────────────────────────────
router.get('/',     subCategoryController.getSubCategories);
router.get('/:id',  subCategoryController.getSubCategoryById);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.use(protect, restrictTo('admin'));
router.post  ('/',    subCategoryController.addSubCategory);
router.put   ('/:id', subCategoryController.updateSubCategory);
router.delete('/:id', subCategoryController.deleteSubCategory);

module.exports = router;