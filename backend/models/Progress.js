import mongoose from 'mongoose'

const progressSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, index: true },
  completedTopics: { type: [String], default: [] },
  completedChallenges: { type: [Number], default: [] },
  lastActive: { type: Date, default: null },
}, { versionKey: false })

export const Progress = mongoose.model('Progress', progressSchema)