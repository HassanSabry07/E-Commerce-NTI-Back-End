const HeroSettings = require('../models/heroSettings.model');

exports.getHeroSettings = async (req, res) => {
  try {
    let settings = await HeroSettings.findOne();
    if (!settings) settings = await HeroSettings.create({});
    res.status(200).json({ message: 'Hero Settings', data: settings });
  } catch (err) {
    console.error(`Error In getHeroSettings(): ${err.message}`);
    res.status(500).json({ message: 'Getting Hero Settings failed' });
  }
};

exports.updateHeroSettings = async (req, res) => {
  try {
    let settings = await HeroSettings.findOne();
    if (!settings) settings = await HeroSettings.create(req.body);
    else { Object.assign(settings, req.body); await settings.save(); }
    res.status(200).json({ message: 'Hero Settings updated', data: settings });
  } catch (err) {
    console.error(`Error In updateHeroSettings(): ${err.message}`);
    res.status(500).json({ message: 'Updating Hero Settings failed' });
  }
};
