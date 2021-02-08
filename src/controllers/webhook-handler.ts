import { Jikan } from 'node-myanimelist'
import { findBestMatch } from 'string-similarity'
import { JikanAnimeResult, WebhookEvent, WebhookPayload } from 'types'
import { getTVDBEpisodeName, parseGuidString } from 'utils/tvdb'

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
