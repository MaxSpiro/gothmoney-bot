import * as functions from 'firebase-functions'
import {rwClient as client} from './twitter-client'
import {getRandomEmojis, music} from './emojis'
import {getAllSongIds, getRandomSnippetFromLyrics, getRandomArrayElement, getTitleArtistFromId} from './genius'
import {TitleArtist, ArtistSearch} from './types/genius-types'

const artists: ArtistSearch[] = [
  {artistName: 'yung lean', nSongs: 100},
  {artistName: 'bladee', nSongs: 100},
  {artistName: 'sickboyrari', nSongs: 100},
  {artistName: 'ysb og', nSongs: 50, searchTerms: ' dope runna'},
]
const linesPerLyric = 2

exports.sendTweet = functions.pubsub.schedule('0 */2 * * *').onRun(main)

async function main() {
  try {
    const allSongIds = await getAllSongIds(artists)
    let tweetMaterial = await generateTweetMaterial(allSongIds)
    while (!tweetMaterial || tweetMaterial.length > 200) {
      tweetMaterial = await generateTweetMaterial(allSongIds)
    }
    const {id, text} = await sendTweet(tweetMaterial)
    // eslint-disable-next-line no-console
    console.log(`Tweet ${id} sent:\n${text}`)
  } catch (e) {
    console.error(e)
  }
}

const generateTweetMaterial = async (allSongIds: number[]): Promise<string | undefined> => {
  const randomSongId = getRandomArrayElement(allSongIds)

  const titleArtist: TitleArtist = await getTitleArtistFromId(randomSongId)
  const snippet = await getRandomSnippetFromLyrics(randomSongId, linesPerLyric)
  if (snippet) {
    return snippet + getRandomEmojis() + '\n' +
      `${music}${titleArtist.title.toLowerCase()} - ${titleArtist.artist.toLowerCase()}${music}`
  } else {
    console.warn('no snippet')
    return undefined
  }
}


const sendTweet = async (text: string): Promise<{ id: string, text: string }> => {
  const {data: createdTweet} = await client.v2.tweet(text)
  return createdTweet
}

