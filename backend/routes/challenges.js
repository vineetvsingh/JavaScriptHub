import { Router } from 'express'
import { challenges } from '../data/content.js'

const router = Router()

const toCard = ({ id, title, description, level, tags }) => ({
  id, title, description, level, tags
})

router.get('/', (req, res) => {
  const { level } = req.query
  const filtered = level ? challenges.filter(c => c.level === level) : challenges
  res.json({ challenges: filtered.map(toCard), total: filtered.length })
})

router.get('/:id', (req, res) => {
  const challenge = challenges.find(c => c.id === parseInt(req.params.id))
  if (!challenge) return res.status(404).json({ error: 'Challenge not found' })
  res.json(challenge)
})

export default router