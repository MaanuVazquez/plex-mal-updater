import { getMediaInfoFromWebhook } from 'logging/media'
import { WebhookEvent, WebhookPayload } from 'types'
import { updateListFromTVDB } from 'controllers/media'
import { logInfo } from 'utils/log'
import { parseGuidString } from 'utils/media'
import { addUncompletedShowEpisode } from 'db/uncompletedShow'

let currentShow: string | null = null

export default async function ({ Metadata, event }: WebhookPayload): Promise<void> {
  if (event !== WebhookEvent.MEDIA_SCROBBLE) return

  const { id, episode } = parseGuidString(Metadata.guid)

  if (currentShow) {
    if (currentShow === Metadata.guid) return

    addUncompletedShowEpisode(id, Number(episode), Metadata.grandparentTitle)

    return
  }

  logInfo('[WEBHOOK][RECEIVED]', getMediaInfoFromWebhook(Metadata))

  currentShow = Metadata.guid

  await updateListFromTVDB(id, episode, Metadata.grandparentTitle)

  currentShow = null
}
