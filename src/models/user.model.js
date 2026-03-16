const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ─── Address Sub-Schema ───────────────────────────────────────────────────────
const addressSchema = new mongoose.Schema(
  {
    street:      { type: String, required: true, trim: true },
    city:        { type: String, required: true, trim: true },
    governorate: { type: String, required: true, trim: true },
    isDefault:   { type: Boolean, default: false },
    isDeleted:   { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── Phone Sub-Schema ─────────────────────────────────────────────────────────
const phoneSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
      match: [/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number'],
    },
    isDefault: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { _id: false }
);

// ─── User Schema ──────────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    phones:    [phoneSchema],
    addresses: [addressSchema],
    isDeleted: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

// ─── Hash password on create ──────────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// ─── Instance Method: Compare Password ───────────────────────────────────────
userSchema.methods.isCorrectPassword = function (plain) {
  return bcrypt.compareSync(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);