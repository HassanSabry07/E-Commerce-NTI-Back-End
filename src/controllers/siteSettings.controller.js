const SiteSettings = require('../models/siteSettings.model');
const path = require('path');

exports.getSettings = async (req, res) => {
  try {
    let s = await SiteSettings.findOne();
    if (!s) s = await SiteSettings.create({});
    res.status(200).json({ message: 'Settings', data: s });
  } catch (err) { res.status(500).json({ message: 'Failed' }); }
};

exports.updateSettings = async (req, res) => {
  try {
    let s = await SiteSettings.findOne();
    const body = { ...req.body };

    // handle JSON arrays sent as strings
    if (typeof body.aboutCards === 'string') body.aboutCards = JSON.parse(body.aboutCards);
    if (typeof body.customLinks === 'string') body.customLinks = JSON.parse(body.customLinks);

    // handle uploaded about image
    if (req.file?.filename) body.aboutImage = req.file.filename;

    if (!s) s = await SiteSettings.create(body);
    else { Object.assign(s, body); await s.save(); }
    res.status(200).json({ message: 'Settings updated', data: s });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed' });
  }
};
