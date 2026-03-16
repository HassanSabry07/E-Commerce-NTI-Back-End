const Notification = require('../models/notification.model');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('product', 'title stock')
      .sort({ createdAt: -1 });
    res.status(200).json({ message: 'Notifications', data: notifications });
  } catch (err) { res.status(500).json({ message: 'Failed' }); }
};

exports.markOneRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ message: 'Marked as read' });
  } catch (err) { res.status(500).json({ message: 'Failed' }); }
};

exports.deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (err) { res.status(500).json({ message: 'Failed' }); }
};
