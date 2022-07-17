import {getLyrics} from 'genius-lyrics-api'
import axios from 'axios'
import {Song, TitleArtist, ArtistSearch} from './types/genius-types'

const geniusApiKey = ''


const getRandomSnippetFromLyrics = async (songId: number, numLines: number): Promise<string | undefined> => {
  const {title, artist} = await getTitleArtistFromId(songId)

  let lyrics: string | undefined = await getSongLyric({title, artist})

  if (!lyrics) {
    return undefined
  }

  if (lyrics.includes('[Intro')) {
    lyrics = lyrics.substring(lyrics.indexOf('\n', lyrics.indexOf('[Intro')) + 1)
  }

  const lines: string[] = lyrics.split('\n').filter((line) => line && !/^\[.*\]$/.test(line))
  const multiples: number[] = [0]
  for (let i = numLines; i < lines.length - numLines; i += numLines) {
    multiples.push(i)
  }
  const index: number = multiples[Math.floor((Math.random() * multiples.length))]
  const text: string = lines.slice(index, index + numLines).join('\n')


  return text
}


const getAllSongIds = async (artists: ArtistSearch[]): Promise<number[]> => {
  let completeSongs: number[] = []
  try {
    for (const {artistName, nSongs, searchTerms} of artists) {
      let thisArtistSongs: number[] = []
      let page = 1
      const artistId = await artistIdFromName(artistName + (searchTerms ? ` ${searchTerms}` : ''))
      if (!artistId) {
        continue
      }
      while (thisArtistSongs.length < nSongs) {
        const AXIOS_URL = `https://api.genius.com/artists/${artistId}/songs?sort=popularity&per_page=50&page=${page}`
        const pageSongs: Song[] = (await axios.get(AXIOS_URL, {
          headers: {
            'Authorization': `Bearer ${geniusApiKey}`,
          },
        })).data.response.songs

        if (!pageSongs.length) {
          break
        }
        thisArtistSongs = thisArtistSongs.concat(pageSongs.filter((song) => {
          const complete = song.lyrics_state === 'complete'
          const mainArtist = song.primary_artist.name.toLowerCase()

          return complete && (mainArtist.includes(artistName.toLowerCase()))
        }).map((song) => {
          return song.id
        }))
        page++
      }
      completeSongs = completeSongs.concat(thisArtistSongs)
    }
  } catch (err) {
    console.error(err)
  }
  return completeSongs
}

const getRandomArrayElement = <Type>(array: Array<Type>): Type => {
  return array[Math.floor(Math.random() * array.length)]
}

const getTitleArtistFromId = async (songId: number): Promise<{ title: string, artist: string }> => {
  const song: Song = (await axios.get(`https://api.genius.com/songs/${songId}`, {
    headers: {
      'Authorization': `Bearer ${geniusApiKey}`,
    },
  })).data.response.song

  return {title: song.title, artist: song.primary_artist.name}
}

const getSongLyric = async ({title, artist}: TitleArtist): Promise<string | undefined> => {
  try {
    const options = {
      apiKey: geniusApiKey,
      title,
      artist,
      optimizeQuery: true,
    }

    const response: string = await getLyrics(options)

    return !response || response.includes('lyrics for this song have yet to be transcribed') ? undefined : response
  } catch (err) {
    console.error(err)
    return undefined
  }
}

const artistIdFromName = async (name: string): Promise<number | undefined> => {
  try {
    const hits = (await axios.get(`https://api.genius.com/search?q=${name}`, {
      headers: {
        'Authorization': `Bearer ${geniusApiKey}`,
      },
    })).data.response.hits

    if (!hits.length || hits[0].type !== 'song') {
      throw new Error(`no artist found for the name ${name}`)
    } else return hits[0].result.primary_artist.id
  } catch (err) {
    console.error(err)
    return undefined
  }
}

export {getAllSongIds, getRandomSnippetFromLyrics, getRandomArrayElement, getTitleArtistFromId}
