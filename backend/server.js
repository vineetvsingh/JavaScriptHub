import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { connectDB } from './lib/db.js'
import topicsRouter from './routes/topics.js'
import challengesRouter from './routes/challenges.js'
import progressRouter from './routes/progress.js'
import authRouter from './routes/auth.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

// Render (and most PaaS) put us behind a reverse proxy. Trust the first hop
// so express-rate-limit keys on the real client IP via X-Forwarded-For.
app.set('trust proxy', 1)

app.use(helmet())
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }))
app.use(express.json())
app.use(morgan('dev'))

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/api/auth', authRouter)
app.use('/api/topics', topicsRouter)
app.use('/api/challenges', challengesRouter)
app.use('/api/progress', progressRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong' })
})

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`JS.hub API running on port ${PORT}`))
  })
  .catch(err => {
    console.error('Failed to start:', err.message)
    process.exit(1)
  })

export default app
