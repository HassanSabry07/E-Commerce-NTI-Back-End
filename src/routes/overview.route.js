const router = require("express").Router();
const overviewController = require("../controllers/overview.controller");
const { protect, restrictTo } = require("../middlewares/auth.middleware");

router.get("/", overviewController.getOverviews);
router.get("/product/:productId", overviewController.getProductOverviews);

router.use(protect);
router.post("/", overviewController.addOverview);

router.use(restrictTo("admin"));
router.get("/all", overviewController.getAllOverviews);
router.patch("/:id/approve", overviewController.approveOverview);
router.delete("/:id", overviewController.deleteOverview);

module.exports = router;
