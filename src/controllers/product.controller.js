const Product = require('../models/product.model');

exports.getProducts = async (req, res) => {
  try {
    const { category, subCategory, minPrice, maxPrice, search, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (minPrice || maxPrice) { filter.price = {}; if (minPrice) filter.price.$gte = Number(minPrice); if (maxPrice) filter.price.$lte = Number(maxPrice); }
    if (search) filter.$text = { $search: search };
    const sortOptions = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, priceAsc: { price: 1 }, priceDesc: { price: -1 } };
    const products = await Product.find(filter).populate('category', 'name').populate('subCategory', 'name').sort(sortOptions[sort] || sortOptions.newest);
    res.status(200).json({ message: 'Products List', count: products.length, data: products });
  } catch (err) { console.error(`Error In getProducts(): ${err.message}`); res.status(500).json({ message: 'Getting Products failed' }); }
};

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug }).populate('category', 'name').populate('subCategory', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product Details', data: product });
  } catch (err) { console.error(`Error In getProduct(): ${err.message}`); res.status(500).json({ message: 'Getting Product failed' }); }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name').populate('subCategory', 'name');
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product Details', data: product });
  } catch (err) { console.error(`Error In getProductById(): ${err.message}`); res.status(500).json({ message: 'Getting Product failed' }); }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, stock, category, subCategory } = req.body;
    const files = req.files || (req.file ? [req.file] : []);
    if (!files.length) return res.status(400).json({ message: 'Product image is required' });
    const image = files[0].filename;
    const images = files.map(f => f.filename);
    const product = await Product.create({ title, description, price, stock, category, subCategory, image, images });
    res.status(201).json({ message: 'Product created successfully', data: product });
  } catch (err) { console.error(`Error In createProduct(): ${err.message}`); res.status(500).json({ message: 'Creating Product failed' }); }
};

exports.updateProduct = async (req, res) => {
  try {
    const update = { ...req.body };
    const files = req.files || (req.file ? [req.file] : []);
    if (files.length) { update.image = files[0].filename; update.images = files.map(f => f.filename); }
    const product = await Product.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product updated successfully', data: product });
  } catch (err) { console.error(`Error In updateProduct(): ${err.message}`); res.status(500).json({ message: 'Updating Product failed' }); }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted successfully', data: product });
  } catch (err) { console.error(`Error In deleteProduct(): ${err.message}`); res.status(500).json({ message: 'Deleting Product failed' }); }
};
