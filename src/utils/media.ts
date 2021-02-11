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
