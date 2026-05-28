import { Router } from 'express'
import { Progress } from '../models/Progress.js'
import { requireAuth } from '../middleware/requireAuth.js'

const router = Router()

router.use(requireAuth)

const toResponse = (doc) => ({
  completedTopics: doc?.completedTopics ?? [],
  completedChallenges: doc?.completedChallenges ?? [],
  lastActive: doc?.lastActive ?? null,
})

const asyncH = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

router.get('/', asyncH(async (req, res) => {
  const doc = await Progress.findOne({ userId: req.user.sub }).lean()
  res.json(toResponse(doc))
}))

router.post('/topic/:slug', asyncH(async (req, res) => {
  const doc = await Progress.findOneAndUpdate(
    { userId: req.user.sub },
    { $addToSet: { completedTopics: req.params.slug }, $set: { lastActive: new Date() } },
    { upsert: true, new: true, lean: true }
  )
  res.json({ ok: true, progress: toResponse(doc) })
}))

router.delete('/topic/:slug', asyncH(async (req, res) => {
  const doc = await Progress.findOneAndUpdate(
    { userId: req.user.sub },
    { $pull: { completedTopics: req.params.slug }, $set: { lastActive: new Date() } },
    { new: true, lean: true }
  )
  res.json({ ok: true, progress: toResponse(doc) })
}))

router.post('/challenge/:id', asyncH(async (req, res) => {
  const numId = parseInt(req.params.id, 10)
  if (Number.isNaN(numId)) return res.status(400).json({ error: 'Invalid challenge id' })
  const doc = await Progress.findOneAndUpdate(
    { userId: req.user.sub },
    { $addToSet: { completedChallenges: numId }, $set: { lastActive: new Date() } },
    { upsert: true, new: true, lean: true }
  )
  res.json({ ok: true, progress: toResponse(doc) })
}))

router.delete('/challenge/:id', asyncH(async (req, res) => {
  const numId = parseInt(req.params.id, 10)
  if (Number.isNaN(numId)) return res.status(400).json({ error: 'Invalid challenge id' })
  const doc = await Progress.findOneAndUpdate(
    { userId: req.user.sub },
    { $pull: { completedChallenges: numId }, $set: { lastActive: new Date() } },
    { new: true, lean: true }
  )
  res.json({ ok: true, progress: toResponse(doc) })
}))

export default router
