import { getMediaInfoFromWebhook } from 'logging/media'
import { WebhookEvent, WebhookPayload } from 'types'
import { updateListFromTVDB } from 'controllers/media'
import { logInfo } from 'utils/log'
import { parseGuidString } from 'utils/media'
import { addUncompletedShowEpisode } from 'db/uncompletedShow'
import { plexLibraryIsValid } from 'utils'

let currentWorkingShow: string | null = null

export default async function ({ Metadata, event }: WebhookPayload): Promise<void> {
  if (event !== WebhookEvent.MEDIA_SCROBBLE || !plexLibraryIsValid(Metadata.librarySectionTitle)) return

  const { id, episode } = parseGuidString(Metadata.guid)

  if (currentWorkingShow) {
    if (currentWorkingShow === Metadata.guid) return

    addUncompletedShowEpisode(id, Number(episode), Metadata.grandparentTitle)
    return
  }

  logInfo('[WEBHOOK][RECEIVED]', getMediaInfoFromWebhook(Metadata))

  currentWorkingShow = Metadata.guid

  await updateListFromTVDB(id, episode, Metadata.grandparentTitle)

  currentWorkingShow = null
}
