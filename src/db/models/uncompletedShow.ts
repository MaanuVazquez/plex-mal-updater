import mongoose, { Document, Schema } from 'mongoose'

export interface IUncompletedShow extends Document {
  tvdbId: string
  tvdbShowName: string
}

const UncompletedShowSchema = new Schema({
  tvdbId: String,
  tvdbShowName: String
})

const UncompletedShow = mongoose.model<IUncompletedShow>('UncompletedShow', UncompletedShowSchema)

export default UncompletedShow
