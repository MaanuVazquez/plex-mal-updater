import mongoose from 'mongoose'

export default function connectDB(): Promise<typeof mongoose> {
  return mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
}
