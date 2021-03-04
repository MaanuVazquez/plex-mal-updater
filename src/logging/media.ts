import { WebhookMetadata } from 'types'
import { parseGuidString } from 'utils/media'

export function getMediaInfoFromWebhook(webhookMetadata: WebhookMetadata): string {
  const { id } = parseGuidString(webhookMetadata.guid)
  return `${webhookMetadata.grandparentTitle} ${webhookMetadata.parentTitle} ${webhookMetadata.title} ${id}`
}
