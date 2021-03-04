import mongoose, { Document, Schema } from 'mongoose'

export interface IUncompletedShowEpisode extends Document {
  tvdbId: string
  tvdbEpisodeName: string
  viewDate: string
}

const UncompletedShowEpisodeSchema = new Schema({
  tvdbId: String,
  tvdbEpisodeName: String,
  viewDate: String
})

const UncompletedShowEpisode = mongoose.model<IUncompletedShowEpisode>(
  'UncompletedShowEpisode',
  UncompletedShowEpisodeSchema
)

export default UncompletedShowEpisode
