import { Router } from 'express'
import { topics } from '../data/content.js'

const router = Router()

const toCard = ({ slug, title, description, level, icon, tags }) => ({
  slug, title, description, level, icon, tags
})

router.get('/', (req, res) => {
  const { level } = req.query
  const filtered = level ? topics.filter(t => t.level === level) : topics
  res.json({ topics: filtered.map(toCard), total: filtered.length })
})

router.get('/:slug', (req, res) => {
  const topic = topics.find(t => t.slug === req.params.slug)
  if (!topic) return res.status(404).json({ error: 'Topic not found' })
  res.json(topic)
})

export default router