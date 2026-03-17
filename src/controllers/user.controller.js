const User = require('../models/user.model');
const jwt = require('jsonwebtoken');

// ─── Helper: Generate Token ───────────────────────────────────────────────────
const signToken = (user) =>
  jwt.sign(
    { id: user._id, name: user.name, role: user.role },
    process.env.SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

// ─── Get All Users (Admin) ────────────────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' });
    res.status(200).json({ message: 'Users List', data: users });
  } catch (err) {
    console.error(`Error In getUsers(): ${err.message}`);
    res.status(500).json({ message: 'Getting Users failed' });
  }
};

// ─── Get All Admins (Admin) ───────────────────────────────────────────────────
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' });
    res.status(200).json({ message: 'Admins List', data: admins });
  } catch (err) {
    console.error(`Error In getAllAdmins(): ${err.message}`);
    res.status(500).json({ message: 'Getting Admins failed' });
  }
};

// ─── Get Logged-in User ───────────────────────────────────────────────────────
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User Data', data: user });
  } catch (err) {
    console.error(`Error In getUser(): ${err.message}`);
    res.status(500).json({ message: 'Getting User failed' });
  }
};

// ─── Get User By ID (Admin) ───────────────────────────────────────────────────
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User Data', data: user });
  } catch (err) {
    console.error(`Error In getUserById(): ${err.message}`);
    res.status(500).json({ message: 'Getting User failed' });
  }
};

// ─── Register / Add Admin ─────────────────────────────────────────────────────
exports.addUser = (role) => async (req, res) => {
  try {
    role = role.toLowerCase();

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const { name, email, password, phones, addresses } = req.body;
    console.log('📥 addUser body:', { name, email, role }); 

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isDeleted) {
        existingUser.name      = name;
        existingUser.password  = password;
        existingUser.role      = role;
        existingUser.phones    = phones;
        existingUser.addresses = addresses;
        existingUser.isDeleted = false;
        await existingUser.save();
        const token = signToken(existingUser);
        return res.status(201).json({ message: `${role} created successfully`, data: { token } });
      }
      return res.status(400).json({ message: 'Email already exists' });
    }

    const user = await User.create({ name, email, password, role, phones, addresses });
    const token = signToken(user);
    res.status(201).json({ message: `${role} created successfully`, data: { token } });
  } catch (err) {
    console.error(`Error In addUser(): ${err.message}`);
    console.error(err); 
    res.status(500).json({ message: `${role} creation failed` });
  }
};

// ─── Login ────────────────────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.isCorrectPassword(password)) {
      return res.status(401).json({ message: 'Incorrect email or password' });
    }

    const token = signToken(user);
    res.status(200).json({ message: 'Logged in successfully', data: { token } });
  } catch (err) {
    console.error(`Error In login(): ${err.message}`);
    res.status(500).json({ message: 'Login failed' });
  }
};

// ─── Update Logged-in User ────────────────────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phones, addresses } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, email, phones, addresses },
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: 'Profile updated successfully', data: user });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    console.error(`Error In updateUser(): ${err.message}`);
    res.status(500).json({ message: 'Updating User failed' });
  }
};

// ─── Change Password ──────────────────────────────────────────────────────────
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!user || !user.isCorrectPassword(oldPassword)) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.error(`Error In changePassword(): ${err.message}`);
    res.status(500).json({ message: 'Changing Password failed' });
  }
};

// ─── Delete Logged-in User (Soft Delete) ─────────────────────────────────────
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({ message: 'User deleted successfully', data: user });
  } catch (err) {
    console.error(`Error In deleteUser(): ${err.message}`);
    res.status(500).json({ message: 'Deleting User failed' });
  }
};

// ─── Delete User By ID (Admin - Soft Delete) ──────────────────────────────────
exports.deleteUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(400).json({ message: "You can't delete another admin" });
    }

    user.isDeleted = true;
    await user.save();

    res.status(200).json({ message: `${user.role} deleted successfully`, data: user });
  } catch (err) {
    console.error(`Error In deleteUserById(): ${err.message}`);
    res.status(500).json({ message: 'Deleting User failed' });
  }
};