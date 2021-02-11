import { getMediaInfoFromWebhook } from 'logging/media'
import { WebhookEvent, WebhookPayload } from 'types'
import { updateListFromTVDB } from 'controllers/media'
import { logInfo } from 'utils/log'
import { parseGuidString } from 'utils/media'

export default async function ({ Metadata, event }: WebhookPayload): Promise<void> {
  if (event !== WebhookEvent.MEDIA_SCROBBLE) return

  const { id, episode } = parseGuidString(Metadata.guid)

  logInfo('[WEBHOOK][RECEIVED]', getMediaInfoFromWebhook(Metadata))

  updateListFromTVDB(id, episode, Metadata.grandparentTitle)
}
