import express from 'express'
import multer from 'multer'
import webhookHandler from 'controllers/webhook-handler'
import dotenv from 'dotenv'
import { getLoginURI } from 'utils/token'
import { authenticateUser, refreshUserToken } from 'controllers/oauth'
import { CronJob } from 'cron'

dotenv.config()

const app = express()
const upload = multer({
  dest: '/tmp/'
})

const PORT = 3000 || process.env.PORT

app.get('/oauth', async (_, res) => {
  res.redirect(getLoginURI())
})

app.get('/oauthredirect', (req, res) => {
  const { code } = req.query
  if (!code) return
  authenticateUser(code as string)
  res
    .json({
      message: 'success'
    })
    .status(200)
})

app.post('/', upload.single('thumb'), (req, res) => {
  webhookHandler(JSON.parse(req.body.payload))
  res.status(200).send('ok!')
})

app.listen(PORT, () => {
  console.log("Hey! we're running on port", PORT)
})

new CronJob('* 0 * * * *', refreshUserToken).start()
