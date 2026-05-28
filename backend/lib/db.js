import mongoose from 'mongoose'

let connectPromise = null

export function connectDB() {
  if (connectPromise) return connectPromise

  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI not set in .env')

  connectPromise = mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10_000,
  }).then(conn => {
    console.log('MongoDB connected:', conn.connection.host)
    return conn
  }).catch(err => {
    connectPromise = null
    throw err
  })

  return connectPromise
}