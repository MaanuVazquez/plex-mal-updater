import fetch from 'node-fetch'

function getTVDBLink(showId: string): string {
  return `https://api.thetvdb.com/series/${showId}/episodes`
}

export interface TVDBData {
  id: string
  episode: string
}

export function parseGuidString(guid: string): TVDBData {
  const slashSplit = guid.split('/')
  const questionMarkSplit = slashSplit[4].split('?')
  return {
    id: slashSplit[2],
    episode: questionMarkSplit[0]
  }
}

export async function getTVDBEpisodeName(showId: string, episodeId: string): Promise<string> {
  const response = await fetch(getTVDBLink(showId))
  const { data } = await response.json()
  return data[Number(episodeId) - 1].episodeName
}
