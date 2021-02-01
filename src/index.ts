import express from 'express'
import multer from 'multer'
import webhookHandler from './webhookHandler'

const app = express()
const upload = multer({
  dest: '/tmp/'
})

const PORT = 3000 || process.env.PORT

app.get('/', (_, res) => {
  res.send('Hello World!')
})

app.post('/', upload.single('thumb'), (req, res) => {
  webhookHandler(JSON.parse(req.body.payload))
  res.status(200).send('ok!')
})

app.listen(PORT, () => {
  console.log("Hey! we're running on port", PORT)
})
