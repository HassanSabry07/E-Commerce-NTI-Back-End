const FAQ = require('../models/faq.model');

// Public - only published FAQs
exports.getFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isDeleted: false, isPublished: true });
    res.status(200).json({ message: 'FAQs List', data: faqs });
  } catch (err) {
    console.error(`Error In getFAQs(): ${err.message}`);
    res.status(500).json({ message: 'Getting FAQs failed' });
  }
};

// Admin - all FAQs
exports.getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find({ isDeleted: false }).populate('askedBy', 'name email');
    res.status(200).json({ message: 'All FAQs', data: faqs });
  } catch (err) {
    console.error(`Error In getAllFAQs(): ${err.message}`);
    res.status(500).json({ message: 'Getting FAQs failed' });
  }
};

// User asks a question
exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    const faq = await FAQ.create({ question, askedBy: req.user._id });
    res.status(201).json({ message: 'Question submitted!', data: faq });
  } catch (err) {
    console.error(`Error In askQuestion(): ${err.message}`);
    res.status(500).json({ message: 'Submitting question failed' });
  }
};

// Admin adds FAQ directly
exports.addFAQ = async (req, res) => {
  try {
    const { question, answer } = req.body;
    const faq = await FAQ.create({ question, answer, isPublished: true });
    res.status(201).json({ message: 'FAQ created successfully', data: faq });
  } catch (err) {
    console.error(`Error In addFAQ(): ${err.message}`);
    res.status(500).json({ message: 'Creating FAQ failed' });
  }
};

// Admin answers and publishes
exports.answerFAQ = async (req, res) => {
  try {
    const { answer, isPublished } = req.body;
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      { answer, isPublished: isPublished ?? true },
      { new: true }
    );
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json({ message: 'FAQ updated', data: faq });
  } catch (err) {
    console.error(`Error In answerFAQ(): ${err.message}`);
    res.status(500).json({ message: 'Updating FAQ failed' });
  }
};

exports.deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!faq) return res.status(404).json({ message: 'FAQ not found' });
    res.status(200).json({ message: 'FAQ deleted', data: faq });
  } catch (err) {
    console.error(`Error In deleteFAQ(): ${err.message}`);
    res.status(500).json({ message: 'Deleting FAQ failed' });
  }
};
