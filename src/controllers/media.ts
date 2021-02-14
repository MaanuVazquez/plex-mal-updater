import { Jikan } from 'node-myanimelist'
import { findBestMatch } from 'string-similarity'
import { getTVDBEpisodeName } from 'api/tvdb'
import { getStoredCredentials } from 'utils/token'
import { AnimeListStatus, getAnimeList, updateList } from 'api/mal'
import { logError, logInfo } from 'utils/log'
import { getDate } from 'utils'
import {
  addUncompletedShowEpisode,
  getUncompletedTVEpisodes,
  getUncompletedTVShows,
  removeShow,
  removeShowEpisode
} from 'db/uncompletedShow'

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

async function matchAnimeEpisodes(malId: number, episodeName: string): Promise<number | null> {
  const { episodes } = await Jikan.anime(malId).episodes()

  const everyEpisodeName = episodes.map(episode => episode.title.toLowerCase())

  if (!everyEpisodeName.length) return null

  const match = findBestMatch(episodeName.toLowerCase(), everyEpisodeName)

  if (match.bestMatch.rating < 0.6) return null

  return match.bestMatchIndex
}

export interface AnimeResult {
  malId: number
  episodeNumber: number
  airing: boolean
  totalEpisodes: number
}

export async function detectAnimeByTitleAndEpisode(title: string, name: string): Promise<AnimeResult | void> {
  const { results }: { results: JikanAnimeResult[] } = await Jikan.search().anime({
    q: title
  })

  for (const anime of results.slice(0, 10)) {
    const animeEpisodeFound = await matchAnimeEpisodes(anime.mal_id, name)

    if (animeEpisodeFound != null) {
      logInfo('[JIKAN]', 'Episode found:', animeEpisodeFound)
      return {
        malId: anime.mal_id,
        episodeNumber: animeEpisodeFound,
        airing: anime.airing,
        totalEpisodes: anime.episodes
      }
    }
  }
}

interface SyncMalParams {
  tvdb: {
    id: string
    episodeNumber: number
    showTitle: string
  }
  mal: {
    id: number
    episodeNumber: number
    airing: boolean
    totalEpisodes: number
  }
  accessToken: string
  viewDate?: string
}

async function syncToMAL({ mal, accessToken, tvdb, viewDate }: SyncMalParams): Promise<void> {
  const { [mal.id]: animeOnList } = await getAnimeList(accessToken)

  if (
    animeOnList &&
    (animeOnList.status === AnimeListStatus.COMPLETED || animeOnList.num_episodes_watched >= mal.episodeNumber)
  ) {
    await removeShow(tvdb.id)
    return
  }

  const isLast = !mal.airing && mal.episodeNumber === mal.totalEpisodes
  const isFirst = mal.episodeNumber === 1

  await updateList(accessToken, {
    malId: mal.id.toString(),
    num_watched_episodes: mal.episodeNumber,
    status: isLast ? AnimeListStatus.COMPLETED : AnimeListStatus.WATCHING,
    ...(isFirst ? { start_date: viewDate || getDate() } : null),
    ...(isLast ? { finish_date: viewDate || getDate() } : null)
  })

  if (isLast) {
    await removeShow(tvdb.id)
  } else {
    await removeShowEpisode(tvdb.id, tvdb.episodeNumber)
  }

  logInfo('[MAL][LIST_UPDATE]', tvdb.id, tvdb.showTitle, tvdb.episodeNumber.toString(), 'success')
}

export async function updateListFromTVDB(
  tvdbId: string,
  episode: string,
  showTitle: string,
  viewDate?: string
): Promise<void> {
  const tvdbEpisodeNumber = Number(episode)
  try {
    const episodeName = await getTVDBEpisodeName(tvdbId, episode)
    const animedDetected = await detectAnimeByTitleAndEpisode(showTitle, episodeName)

    if (!animedDetected) throw Error('Anime not found in MAL')

    const credentials = await getStoredCredentials()

    if (!credentials) throw Error('Not logged in MAL')

    const { episodeNumber, airing, malId, totalEpisodes } = animedDetected

    const { accessToken } = credentials

    await syncToMAL({
      accessToken,
      mal: {
        episodeNumber,
        airing,
        totalEpisodes,
        id: malId
      },
      tvdb: {
        id: tvdbId,
        episodeNumber: tvdbEpisodeNumber,
        showTitle
      },
      viewDate
    })
  } catch (error) {
    logError('[MAL][LIST_UPDATE]', error.message)
    addUncompletedShowEpisode(tvdbId, tvdbEpisodeNumber, showTitle)
  }
}

export async function processUncompletedShows(): Promise<void> {
  logInfo('[MAL][LIST_UPDATE]', 'Processing remaning updates...')

  const shows = await getUncompletedTVShows()

  if (!shows.length) return

  for (const show of shows) {
    logInfo('[MAL][LIST_UPDATE]', 'Processing', show.tvdbShowName)
    const episodesToSync = await getUncompletedTVEpisodes(show.tvdbId)

    if (!episodesToSync.length) return

    for (const episode of episodesToSync) {
      await updateListFromTVDB(show.tvdbId, episode.tvdbEpisodeNumber.toString(), show.tvdbShowName, episode.viewDate)
    }
  }
}
