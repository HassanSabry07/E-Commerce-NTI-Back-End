const Category = require('../models/category.model');
const SubCategory = require('../models/subCategory.model');

// ─── Get All Categories ───────────────────────────────────────────────────────
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    const subCategories = await SubCategory.find({
      parentCategory: { $in: categories.map((c) => c._id) },
    }).select('name parentCategory');

    const data = categories.map((category) => ({
      _id: category._id,
      name: category.name,
      subCategories: subCategories.filter(
        (sub) => sub.parentCategory.toString() === category._id.toString()
      ),
    }));

    res.status(200).json({ message: 'Get your Categories', data });
  } catch (err) {
    console.error(`Error In getCategories(): ${err.message}`);
    res.status(500).json({ message: 'Getting Categories failed' });
  }
};

// ─── Get Category By ID ───────────────────────────────────────────────────────
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: 'Category Details', data: category });
  } catch (err) {
    console.error(`Error In getCategoryById(): ${err.message}`);
    res.status(500).json({ message: 'Getting Category failed' });
  }
};

// ─── Add Category ─────────────────────────────────────────────────────────────
exports.addCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json({ message: `${category.name} Category created successfully`, data: category });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Category already exists' });
    console.error(`Error In addCategory(): ${err.message}`);
    res.status(500).json({ message: 'Category creation failed' });
  }
};

// ─── Update Category ──────────────────────────────────────────────────────────
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: `${category.name} Category updated successfully`, data: category });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Category already exists' });
    console.error(`Error In updateCategory(): ${err.message}`);
    res.status(500).json({ message: 'Updating Category failed' });
  }
};

// ─── Delete Category ──────────────────────────────────────────────────────────
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!category) return res.status(404).json({ message: 'Category not found' });
    res.status(200).json({ message: `${category.name} Category deleted successfully`, data: category });
  } catch (err) {
    console.error(`Error In deleteCategory(): ${err.message}`);
    res.status(500).json({ message: 'Deleting Category failed' });
  }
};