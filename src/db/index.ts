import mongoose from 'mongoose'

export default function connectDB(): void {
  mongoose.connect(process.env.MONGO_DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
}
