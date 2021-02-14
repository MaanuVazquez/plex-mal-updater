import express from 'express'
import multer from 'multer'
import { CronJob } from 'cron'
import DBConnect from 'db'
import webhookHandler from 'controllers/webhook-handler'
import { authenticateUser, refreshUserToken } from 'controllers/oauth'
import { processUncompletedShows } from 'controllers/media'
import { getLoginURI } from 'api/mal'
import { getOAuthRedirectURI } from 'utils'

DBConnect()

const app = express()
const upload = multer({
  dest: '/tmp/'
})

const PORT = process.env.PORT || 3000

app.get('/oauth', async (req, res) => {
  res.redirect(getLoginURI(getOAuthRedirectURI(req)))
})

app.get('/oauthredirect', (req, res) => {
  const { code } = req.query
  if (!code) return
  authenticateUser(code as string, getOAuthRedirectURI(req))
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

new CronJob('0 0 * * * *', refreshUserToken).start()
new CronJob('0 0 0 * * *', processUncompletedShows).start()
