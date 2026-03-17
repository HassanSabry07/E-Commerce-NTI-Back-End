const mongoose = require('mongoose');

const customLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url:   { type: String, required: true },
  icon:  { type: String, default: '🔗' },
}, { _id: true });

const aboutCardSchema = new mongoose.Schema({
  icon:  { type: String, default: '✦' },
  title: { type: String, required: true },
  text:  { type: String, required: true },
}, { _id: true });

const siteSettingsSchema = new mongoose.Schema({
  // About page
  aboutTitle:    { type: String, default: 'About LUXE' },
  aboutSubtitle: { type: String, default: 'Our Story' },
  aboutText:     { type: String, default: 'We are a luxury fashion brand...' },
  aboutImage:    { type: String, default: '' },
  aboutCards:    [aboutCardSchema],

  // Contact info
  phone:    { type: String, default: '' },
  email:    { type: String, default: '' },
  address:  { type: String, default: '' },
  facebook: { type: String, default: '' },
  instagram:{ type: String, default: '' },
  twitter:  { type: String, default: '' },
  linkedin: { type: String, default: '' },
  tiktok:   { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  customLinks: [customLinkSchema],
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
