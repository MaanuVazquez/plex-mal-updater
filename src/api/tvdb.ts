import fetch from 'node-fetch'

function getTVDBLink(showId: string): string {
  return `https://api.thetvdb.com/series/${showId}/episodes`
}

export async function getTVDBEpisodeName(showId: string, episodeId: string): Promise<string> {
  const response = await fetch(getTVDBLink(showId))
  const { data } = await response.json()
  return data[Number(episodeId) - 1].episodeName
}
