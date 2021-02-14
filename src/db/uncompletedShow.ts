import { UncompletedShow, UncompletedShowEpisode } from 'db/models'
import { IUncompletedShowEpisode } from 'db/models/uncompletedShowEpisode'
import { IUncompletedShow } from './models/uncompletedShow'

export async function addUncompletedShowEpisode(
  tvdbId: string,
  episode: number,
  showTitle: string
): Promise<IUncompletedShowEpisode | void> {
  const uncompletedShow = await UncompletedShow.findOne({
    tvdbId
  })

  if (!uncompletedShow) {
    const newUncompletedShow = new UncompletedShow()
    newUncompletedShow.tvdbId = tvdbId
    newUncompletedShow.tvdbShowName = showTitle
    newUncompletedShow.save()
  }

  const episodeExists = await UncompletedShowEpisode.findOne({ tvdbId, episode })

  if (episodeExists) return

  const uncompletedShowEpisode = new UncompletedShowEpisode()

  uncompletedShowEpisode.tvdbId = tvdbId
  uncompletedShowEpisode.tvdbEpisodeNumber = episode

  return uncompletedShowEpisode.save()
}

export async function getUncompletedTVShows(): Promise<IUncompletedShow[]> {
  return UncompletedShow.find()
}

export async function getUncompletedTVEpisodes(tvdbId: string): Promise<IUncompletedShowEpisode[]> {
  return UncompletedShowEpisode.find({ tvdbId }).exec()
}

export async function removeShow(tvdbId: string): Promise<void> {
  await UncompletedShowEpisode.remove({ tvdbId })
  await UncompletedShow.remove({ tvdbId })
}

export async function removeShowEpisode(tvdbId: string, tvdbEpisodeNumber: number): Promise<void> {
  await UncompletedShowEpisode.remove({ tvdbId, tvdbEpisodeNumber })
}
