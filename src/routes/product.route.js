const router = require('express').Router();
const productController = require('../controllers/product.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

router.get('/',       productController.getProducts);
router.get('/id/:id', productController.getProductById);
router.get('/:slug',  productController.getProduct);

router.use(protect, restrictTo('admin'));
router.post('/',    upload.array('images', 5), productController.createProduct);
router.put('/:id',  upload.array('images', 5), productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
