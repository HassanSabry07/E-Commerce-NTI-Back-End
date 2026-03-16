const SubCategory = require('../models/subCategory.model');

// ─── Get All SubCategories ────────────────────────────────────────────────────
exports.getSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.find().populate('parentCategory', 'name');
    res.status(200).json({ message: 'SubCategories List', data: subCategories });
  } catch (err) {
    console.error(`Error In getSubCategories(): ${err.message}`);
    res.status(500).json({ message: 'Getting SubCategories failed' });
  }
};

// ─── Get SubCategory By ID ────────────────────────────────────────────────────
exports.getSubCategoryById = async (req, res) => {
  try {
    const subCategory = await SubCategory.findById(req.params.id).populate('parentCategory', 'name');
    if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });
    res.status(200).json({ message: 'SubCategory Details', data: subCategory });
  } catch (err) {
    console.error(`Error In getSubCategoryById(): ${err.message}`);
    res.status(500).json({ message: 'Getting SubCategory failed' });
  }
};

// ─── Add SubCategory ──────────────────────────────────────────────────────────
exports.addSubCategory = async (req, res) => {
  try {
    const { name, parentCategory } = req.body;
    const subCategory = await SubCategory.create({ name, parentCategory });
    res.status(201).json({ message: `${subCategory.name} SubCategory created successfully`, data: subCategory });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'SubCategory already exists' });
    console.error(`Error In addSubCategory(): ${err.message}`);
    res.status(500).json({ message: 'SubCategory creation failed' });
  }
};

// ─── Update SubCategory ───────────────────────────────────────────────────────
exports.updateSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });
    res.status(200).json({ message: `${subCategory.name} SubCategory updated successfully`, data: subCategory });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'SubCategory already exists' });
    console.error(`Error In updateSubCategory(): ${err.message}`);
    res.status(500).json({ message: 'Updating SubCategory failed' });
  }
};

// ─── Delete SubCategory ───────────────────────────────────────────────────────
exports.deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!subCategory) return res.status(404).json({ message: 'SubCategory not found' });
    res.status(200).json({ message: `${subCategory.name} SubCategory deleted successfully`, data: subCategory });
  } catch (err) {
    console.error(`Error In deleteSubCategory(): ${err.message}`);
    res.status(500).json({ message: 'Deleting SubCategory failed' });
  }
};