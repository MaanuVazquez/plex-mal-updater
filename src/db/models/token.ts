import mongoose, { Document, Schema } from 'mongoose'

export interface IToken extends Document {
  tokenType: string
  expiresIn: number
  accessToken: string
  refreshToken: string
}

const TokenSchema = new Schema({
  expiresIn: Number,
  refreshToken: String,
  accessToken: String,
  tokenType: String
})

const Token = mongoose.model<IToken>('Token', TokenSchema)

export default Token
