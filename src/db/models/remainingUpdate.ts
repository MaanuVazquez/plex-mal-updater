import mongoose, { Document, Schema } from 'mongoose'

export interface IReaminingUpdate extends Document {
  tvdbId: string
  episode: number
  showName: string
}

const RemainingUpdateSchema = new Schema({
  tvdbId: String,
  episode: String,
  showName: String
})

const RemainingUpdate = mongoose.model<IReaminingUpdate>('RemainingUpdate', RemainingUpdateSchema)

export default RemainingUpdate
