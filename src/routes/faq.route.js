const router = require('express').Router();
const faqController = require('../controllers/faq.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');

router.get('/', faqController.getFAQs);

router.use(protect);
router.post('/ask', faqController.askQuestion);

router.use(restrictTo('admin'));
router.get('/all',        faqController.getAllFAQs);
router.post('/',          faqController.addFAQ);
router.put('/:id/answer', faqController.answerFAQ);
router.delete('/:id',     faqController.deleteFAQ);

module.exports = router;
