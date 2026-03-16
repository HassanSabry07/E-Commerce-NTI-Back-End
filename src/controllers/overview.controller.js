const Overview = require('../models/overview.model');

// Public - approved overviews for a specific product
exports.getProductOverviews = async (req, res) => {
  try {
    const overviews = await Overview.find({ product: req.params.productId, isApproved: true })
      .populate('user', 'name');
    res.status(200).json({ message: 'Product Reviews', data: overviews });
  } catch (err) {
    console.error(`Error In getProductOverviews(): ${err.message}`);
    res.status(500).json({ message: 'Getting reviews failed' });
  }
};

// Public - approved for home
exports.getOverviews = async (req, res) => {
  try {
    const overviews = await Overview.find({ isApproved: true }).populate('user', 'name');
    res.status(200).json({ message: 'Overviews', data: overviews });
  } catch (err) {
    console.error(`Error In getOverviews(): ${err.message}`);
    res.status(500).json({ message: 'Getting Overviews failed' });
  }
};

// Admin - all overviews
exports.getAllOverviews = async (req, res) => {
  try {
    const overviews = await Overview.find().populate('user', 'name email').populate('product', 'title');
    res.status(200).json({ message: 'All Overviews', data: overviews });
  } catch (err) {
    console.error(`Error In getAllOverviews(): ${err.message}`);
    res.status(500).json({ message: 'Getting Overviews failed' });
  }
};

// User adds review for a product
exports.addOverview = async (req, res) => {
  try {
    const { message, rating, productId } = req.body;
    const overview = await Overview.create({ user: req.user._id, product: productId, message, rating });
    res.status(201).json({ message: 'Review submitted!', data: overview });
  } catch (err) {
    console.error(`Error In addOverview(): ${err.message}`);
    res.status(500).json({ message: 'Adding review failed' });
  }
};

exports.approveOverview = async (req, res) => {
  try {
    const overview = await Overview.findByIdAndUpdate(req.params.id, { isApproved: req.body.isApproved }, { new: true });
    if (!overview) return res.status(404).json({ message: 'Overview not found' });
    res.status(200).json({ message: 'Updated', data: overview });
  } catch (err) {
    console.error(`Error In approveOverview(): ${err.message}`);
    res.status(500).json({ message: 'Updating failed' });
  }
};

exports.deleteOverview = async (req, res) => {
  try {
    const overview = await Overview.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!overview) return res.status(404).json({ message: 'Overview not found' });
    res.status(200).json({ message: 'Deleted', data: overview });
  } catch (err) {
    console.error(`Error In deleteOverview(): ${err.message}`);
    res.status(500).json({ message: 'Deleting failed' });
  }
};
