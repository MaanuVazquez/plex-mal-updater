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

interface Operation<T> {
  onComplete: (data: T) => void
  onWork: () => Promise<T>
}

class Jikan {
  operations: Operation<unknown>[] = []

  private delay(ms: number): Promise<number> {
    return new Promise(resolve => {
      setInterval(resolve, ms)
    })
  }

  public static getInstance(): Jikan {
    return new Jikan()
  }

  public async getAnime(query: string): Promise<JikanAnimeResult[]> {
    const URI = new URL(API_URLS.searchAnime)
    URI.searchParams.append('q', query)
    URI.searchParams.append('limit', '10')

    return new Promise(resolve => {
      const operation: Operation<JikanAnimeResult[]> = {
        onComplete: resolve,
        onWork: async () => {
          const response = await fetch(URI)
          const data = await response.json()

          return data.results
        }
      }

      this.addOperationToQueue(operation as Operation<unknown>)
    })
  }

  private async fetchAnimeEpisode(malId: string, currentPage = 1): Promise<JikanEpisodesResult[]> {
    if (currentPage !== 1) {
      await this.delay(4000)
    }

    const response = await fetch(`${API_URLS.animeEpisodes(malId)}${currentPage > 1 ? '/' + currentPage : ''}`)

    const { episodes_last_page, episodes } = await response.json()

    if (currentPage === episodes_last_page) return episodes

    return [...episodes, ...(await this.fetchAnimeEpisode(malId, currentPage + 1))]
  }

  public async getAnimeEpisodes(malId: string): Promise<JikanEpisodesResult[]> {
    return new Promise(resolve => {
      const operation: Operation<JikanEpisodesResult[]> = {
        onComplete: resolve,
        onWork: () => this.fetchAnimeEpisode(malId)
      }

      this.addOperationToQueue(operation as Operation<unknown>)
    })
  }

  private async addOperationToQueue(operation: Operation<unknown>): Promise<void> {
    const shouldStart = !this.operations.length
    this.operations.push(operation)

    if (shouldStart) this.processQueue()
  }

  private async processQueue(): Promise<void> {
    if (!this.operations.length) return

    const operation = this.operations.shift()

    const workResult = await operation?.onWork()
    await this.delay(4000)
    operation?.onComplete(workResult)

    this.processQueue()
  }
}

export default Jikan
