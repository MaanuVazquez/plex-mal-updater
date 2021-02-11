import { Jikan } from 'node-myanimelist'
import { findBestMatch } from 'string-similarity'
import { getTVDBEpisodeName } from 'api/tvdb'
import { getStoredCredentials } from 'utils/token'
import { AnimeListStatus, updateList } from 'api/mal'
import { RemainingUpdate } from 'db/models'
import { logError, logInfo } from 'utils/log'

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

export interface AnimeResult {
  malId: number
  episodeNumber: number
  isLast: boolean
}

export interface EpisodeData {
  id: string
  name: string
}

export async function detectAnimeByTitleAndEpisode(
  title: string,
  { id, name }: EpisodeData
): Promise<AnimeResult | void> {
  let animeResult

  const jikanResult = await Jikan.search().anime({
    q: title
  })

  const results: JikanAnimeResult[] = jikanResult.results

  const neededAnimes = results.slice(0, 10)

  for (const anime of neededAnimes) {
    const { episodes } = await Jikan.anime(anime.mal_id).episodes()

    const episodesTitle = episodes.map(episode => episode.title.toLowerCase())

    if (episodesTitle.length) {
      const match = findBestMatch(name.toLowerCase(), episodesTitle)

      if (match.bestMatch.rating >= 0.6) {
        const episodeNumber = Number(id)

        animeResult = {
          malId: anime.mal_id,
          episodeNumber,
          isLast: !anime.airing && anime.episodes === episodeNumber
        }

        break
      }
    }
  }

  return animeResult
}

export async function addRemainingUpdate(tvdbId: string, episode: string, showTitle: string): Promise<void> {
  const episodeNumber = Number(episode)
  const remainingUpdate = await RemainingUpdate.findOne({
    tvdbId
  })

  if (!remainingUpdate) {
    const remainingUpdate = new RemainingUpdate()
    remainingUpdate.tvdbId = tvdbId
    remainingUpdate.episode = episodeNumber
    remainingUpdate.showName = showTitle
    remainingUpdate.save()
    return
  }

  if (remainingUpdate.episode > episodeNumber) return

  remainingUpdate.episode = episodeNumber
  remainingUpdate.save()
}

export async function updateListFromTVDB(tvdbId: string, episode: string, showTitle: string): Promise<boolean> {
  try {
    const episodeName = await getTVDBEpisodeName(tvdbId, episode)
    const animedDetected = await detectAnimeByTitleAndEpisode(showTitle, {
      id: episode,
      name: episodeName
    })

    if (!animedDetected) throw Error('Anime not found in MAL')

    const credentials = await getStoredCredentials()

    if (!credentials) throw Error('Not logged in MAL')

    const { episodeNumber, isLast, malId } = animedDetected
    const { accessToken } = credentials

    await updateList(accessToken, {
      malId: malId.toString(),
      num_watched_episodes: episodeNumber,
      status: isLast ? AnimeListStatus.COMPLETED : AnimeListStatus.WATCHING
    })
    logInfo('[MAL][LIST_UPDATE]', tvdbId, showTitle, episode, 'success')
    return true
  } catch (error) {
    logError('[MAL][LIST_UPDATE]', error.message)
    addRemainingUpdate(tvdbId, episode, showTitle)
    return false
  }
}

export async function processRemainingUpdates(): Promise<void> {
  logInfo('[MAL][LIST_UPDATE]', 'Processing remaning updates...')
  const remainingUpdates = await RemainingUpdate.find()
  if (!remainingUpdates.length) return

  remainingUpdates.forEach(async remainingUpdate => {
    const { tvdbId, episode, showName } = remainingUpdate
    const didUpdate = await updateListFromTVDB(tvdbId, episode.toString(), showName)
    if (!didUpdate) return

    await remainingUpdate.remove()
  })
}
