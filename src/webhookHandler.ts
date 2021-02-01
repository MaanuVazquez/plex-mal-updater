import { Jikan } from 'node-myanimelist'
import { findBestMatch } from 'string-similarity'
import { JikanAnimeResult, WebhookEvent, WebhookPayload } from './types'
import fetch from 'node-fetch'

function getTVDBLink(showId: string): string {
  return `https://api.thetvdb.com/series/${showId}/episodes`
}

async function getTVDBEpisodeName(showId: string, episodeId: string): Promise<string> {
  const response = await fetch(getTVDBLink(showId))
  const { data } = await response.json()
  return data[Number(episodeId) - 1].episodeName
}

interface TVDBData {
  id: string
  episode: string
}

function parseGuidString(guid: string): TVDBData {
  const slashSplit = guid.split('/')
  const questionMarkSplit = slashSplit[4].split('?')
  return {
    id: slashSplit[2],
    episode: questionMarkSplit[0]
  }
}

interface AnimeResult {
  malId: number
  episodeNumber: number
}

async function detectAnimeByTitleAndEpisode(title: string, episodeName: string): Promise<AnimeResult | void> {
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
      const match = findBestMatch(episodeName.toLowerCase(), episodesTitle)

      if (match.bestMatch.rating >= 0.7) {
        animeResult = {
          malId: anime.mal_id,
          episodeNumber: episodes[match.bestMatchIndex].episode_id
        }

        break
      }
    }
  }

  return animeResult
}

export default async function ({ Metadata, event }: WebhookPayload): Promise<void> {
  if (event !== WebhookEvent.MEDIA_PAUSE) return
  const { id, episode } = parseGuidString(Metadata.guid)
  const episodeName = await getTVDBEpisodeName(id, episode)
  console.log(await detectAnimeByTitleAndEpisode(Metadata.grandparentTitle, episodeName))
}
