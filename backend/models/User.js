import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  username: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  verifyOtp: { type: String },
  verifyOtpExpiresAt: { type: Date },
  resetOtp: { type: String },
  resetOtpExpiresAt: { type: Date },
}, { versionKey: false, timestamps: true })

export const User = mongoose.model('User', userSchema)
