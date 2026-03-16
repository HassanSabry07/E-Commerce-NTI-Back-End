const mongoose = require('mongoose');

const heroSettingsSchema = new mongoose.Schema(
  {
    eyebrow:  { type: String, default: 'New Collection 2025' },
    title1:   { type: String, default: 'Discover' },
    title2:   { type: String, default: 'Timeless' },
    title3:   { type: String, default: 'Elegance' },
    subtitle: { type: String, default: 'Curated luxury pieces crafted for those who appreciate the finest things in life.' },
    btn1Text: { type: String, default: 'Shop Now' },
    btn2Text: { type: String, default: 'Explore Collection' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('HeroSettings', heroSettingsSchema);
