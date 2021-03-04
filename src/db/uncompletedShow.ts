import { UncompletedShow, UncompletedShowEpisode } from 'db/models'
import { IUncompletedShowEpisode } from 'db/models/uncompletedShowEpisode'
import { IUncompletedShow } from './models/uncompletedShow'
import { getDate } from 'utils'

export async function addUncompletedShowEpisode(
  tvdbId: string,
  episodeName: string,
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

  const episodeExists = await UncompletedShowEpisode.findOne({ tvdbId, tvdbEpisodeName: episodeName })

  if (episodeExists) return

  const uncompletedShowEpisode = new UncompletedShowEpisode()

  uncompletedShowEpisode.tvdbId = tvdbId
  uncompletedShowEpisode.tvdbEpisodeName = episodeName
  uncompletedShowEpisode.viewDate = getDate()

  return uncompletedShowEpisode.save()
}

export async function getUncompletedTVShows(): Promise<IUncompletedShow[]> {
  return UncompletedShow.find()
}

export async function getUncompletedTVEpisodes(tvdbId: string): Promise<IUncompletedShowEpisode[]> {
  return UncompletedShowEpisode.find({ tvdbId }).exec()
}

export async function removeShow(tvdbId: string): Promise<void> {
  await UncompletedShowEpisode.deleteMany({ tvdbId })
  await UncompletedShow.deleteOne({ tvdbId })
}

export async function removeShowEpisode(tvdbId: string, tvdbEpisodeName: string): Promise<void> {
  await UncompletedShowEpisode.deleteOne({ tvdbId, tvdbEpisodeName })
  const episodes = await getUncompletedTVEpisodes(tvdbId)

  if (!episodes.length) {
    await removeShow(tvdbId)
  }
}
