/* eslint-disable no-unused-vars */
export enum WebhookEvent {
  LIBRARY_ON_DECK = 'library.on.deck', // A new item is added that appears in the user’s On Deck. A poster is also attached to this event.
  LIBRARY_NEW = 'library.new', // A new item is added to a library to which the user has access. A poster is also attached to this event.
  MEDIA_PAUSE = 'media.pause', // – Media playback pauses.
  MEDIA_PLAY = 'media.play', // – Media starts playing. An appropriate poster is attached.
  MEDIA_RATE = 'media.rate', // – Media is rated. A poster is also attached to this event.
  MEDIA_RESUME = 'media.resume', // – Media playback resumes.
  MEDIA_SCROBBLE = 'media.scrobble', // – Media is viewed (played past the 90% mark).
  MEDIA_STOP = 'media.stop', // – Media playback stops.
  ADMIN_DATABASE_BACKUP = 'admin.database.backup', // – A database backup is completed successfully via Scheduled Tasks.
  ADMIN_DATABASE_CORRUPTED = 'admin.database.corrupted', // – Corruption is detected in the server database.
  DEVICE_NEW = 'device.new', // – A device accesses the owner’s server for any reason, which may come from background connection testing and doesn’t necessarily indicate active browsing or playback.
  PLAYBACK_STARTED = 'playback.started' // – Playback is started by a shared user for the server. A poster is also attached to this event.
}

export interface WebhookPayload {
  event: WebhookEvent
  Metadata: {
    librarySectionType: string
    ratingKey: string
    key: string
    skipParent: boolean
    parentRatingKey: string
    grandparentRatingKey: string
    guid: string
    parentGuid: string
    grandparentGuid: string
    type: string
    title: string
    titleSort: string
    grandparentKey: string
    parentKey: string
    librarySectionTitle: string
    librarySectionID: number
    librarySectionKey: string
    grandparentTitle: string
    parentTitle: string
    contentRating: string
    summary: string
    index: number
    parentIndex: number
    viewOffset: number
    viewCount: number
    lastViewedAt: number
    year: number
    thumb: string
    art: string
    parentThumb: string
    grandparentThumb: string
    grandparentArt: string
    grandparentTheme: string
    originallyAvailableAt: string
    addedAt: number
    updatedAt: number
  }
}

export interface JikanAnimeResult {
  mal_id: number
  url: string
  image_url: string
  title: string
  airing: boolean
  synopsis: string
  type: string
  episodes: number
  score: number
  start_date: string
  end_date: string
  members: number
  rated: string
}
