const { default: db } = require('../dist/db')
const { default: UncompletedShowEpisodes } = require('../dist/db/models/uncompletedShowEpisode')

;(async () => {
  await db()

  UncompletedShowEpisodes.find().then(registeredEpisode => {
    registeredEpisode.reduce((accum, episode) => {
      const { tvdbId, tvdbEpisodeNumber } = episode
      if (!accum[episode.tvdbId] || !accum[tvdbId][tvdbEpisodeNumber]) {
        return {
          ...accum,
          [tvdbId]: {
            ...accum[tvdbId],
            [tvdbEpisodeNumber]: episode
          }
        }
      }

      console.log('Found duplicate')
      episode.remove()
      return accum
    }, {})
  })
})()
