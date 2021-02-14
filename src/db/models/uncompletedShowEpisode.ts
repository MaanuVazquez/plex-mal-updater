import mongoose, { Document, Schema } from 'mongoose'

export interface IUncompletedShowEpisode extends Document {
  tvdbId: string
  tvdbEpisodeNumber: number
  viewDate: string
}

const UncompletedShowEpisodeSchema = new Schema({
  tvdbId: String,
  tvdbEpisodeNumber: Number,
  viewDate: String
})

const UncompletedShowEpisode = mongoose.model<IUncompletedShowEpisode>(
  'UncompletedShowEpisode',
  UncompletedShowEpisodeSchema
)

export default UncompletedShowEpisode
