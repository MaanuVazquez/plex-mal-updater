import fetch from 'node-fetch'

const API_URLS = {
  searchAnime: 'https://api.jikan.moe/v3/search/anime',
  animeEpisodes: (malId: string): string => `https://api.jikan.moe/v3/anime/${malId}/episodes`
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

export interface JikanEpisodesResult {
  episode_id: number
  title: string
  title_japanese: string
  title_romanji: string
  aired: string
  filler: boolean
  recap: boolean
  video_url: string
  forum_url: string
}

class Jikan {
  private delay(ms: number): Promise<number> {
    return new Promise(resolve => {
      setInterval(resolve, ms)
    })
  }

  public static getInstance(): Jikan {
    return new Jikan()
  }

  public async getAnime(query: string): Promise<JikanAnimeResult[]> {
    await this.delay(10000)
    const URI = new URL(API_URLS.searchAnime)
    URI.searchParams.append('q', query)
    URI.searchParams.append('limit', '10')

    const response = await fetch(URI)

    return (await response.json()).results
  }

  private async fetchAnimeEpisode(malId: string, currentPage = 1): Promise<JikanEpisodesResult[]> {
    await this.delay(10000)
    const response = await fetch(`${API_URLS.animeEpisodes(malId)}${currentPage > 1 ? '/' + currentPage : ''}`)

    const { episodes_last_page, episodes } = await response.json()

    if (currentPage === episodes_last_page) return episodes

    return [...episodes, ...(await this.fetchAnimeEpisode(malId, currentPage + 1))]
  }

  public async getAnimeEpisodes(malId: string): Promise<JikanEpisodesResult[]> {
    const response = await this.fetchAnimeEpisode(malId)
    return response
  }
}

export default Jikan
