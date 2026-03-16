const express = require('express');
const {
  getUsers,
  getUser,
  addUser,
  login,
  getUserById,
  updateUser,
  deleteUser,
  deleteUserById,
  getAllAdmins,
  changePassword,
} = require('../controllers/user.controller');
const { protect, restrictTo } = require('../middlewares/auth.middleware');
const router = express.Router();

// ─── Public ───────────────────────────────────────────────────────────────────
router.post('/register',  addUser('user'));
router.post('/login',     login);
router.post('/add-admin', addUser('admin')); // ✅ محمي بالـ secretKey في الـ controller

// ─── Protected (User) ─────────────────────────────────────────────────────────
router.use(protect);
router.get   ('/',         getUser);
router.put   ('/',         updateUser);
router.delete('/',         deleteUser);
router.patch ('/password', changePassword);

// ─── Admin ────────────────────────────────────────────────────────────────────
router.use(restrictTo('admin'));
router.get   ('/all',    getUsers);
router.get   ('/admins', getAllAdmins);
router.get   ('/:id',    getUserById);
router.delete('/:id',    deleteUserById);

module.exports = router;
