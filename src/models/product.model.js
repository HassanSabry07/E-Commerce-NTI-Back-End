const mongoose = require("mongoose");
const slugify = require("slugify");
const Cart = require("./cart.model");

const productSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    slug:        { type: String, unique: true, trim: true, index: true },
    description: { type: String, trim: true },
    price:       { type: Number, required: true, index: true },
    stock:       { type: Number, default: 0, min: 0 },
    image:       { type: String, required: true },
    images:      [{ type: String }],
    category:    { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory", required: true, index: true },
    isDeleted:   { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

productSchema.index({ title: "text", description: "text" });
productSchema.index({ createdAt: -1 });

const generateSlug = async (model, title, id) => {
  const base = slugify(title, { lower: true, strict: true, trim: true });
  const exists = await model.findOne({ slug: base });
  return exists ? `${base}-${id.toString().slice(-6)}` : base;
};

productSchema.pre("find",           function () { this.where({ isDeleted: false }); });
productSchema.pre("findOne",        function () { this.where({ isDeleted: false }); });
productSchema.pre("countDocuments", function () { this.where({ isDeleted: false }); });

productSchema.pre("save", async function () {
  if (!this.isModified("title")) return;
  this.slug = await generateSlug(this.constructor, this.title, this._id);
});

productSchema.pre("findOneAndUpdate", async function () {
  this.where({ isDeleted: false });
  const update = this.getUpdate();
  const productId = this.getQuery()._id;
  const newTitle = update.title || update?.$set?.title;
  if (newTitle) {
    const slug = await generateSlug(this.model, newTitle, productId);
    update.$set ? (update.$set.slug = slug) : (update.slug = slug);
  }
  const product = await this.model.findById(productId).select("price");
  this._oldPrice = product?.price ?? null;
});

productSchema.post("findOneAndUpdate", async function (doc) {
  if (!doc || this._oldPrice === null) return;
  if (this._oldPrice !== doc.price) {
    await Cart.updateMany(
      { "items.product": doc._id },
      { $set: { "items.$[elem].isChanged": true } },
      { arrayFilters: [{ "elem.product": doc._id }] }
    );
  }
});

module.exports = mongoose.model("Product", productSchema);
