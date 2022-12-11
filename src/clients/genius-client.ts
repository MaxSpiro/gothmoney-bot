import { getLyrics } from "genius-lyrics-api";

import axios from "axios";
import { Song, TitleArtist } from "../types/genius-types";
import { config } from "../settings/config";

export class GeniusApi {
  constructor(private readonly apiKey: string) {}

  async getArtistSongs({
    artistId,
    page,
  }: {
    artistId: number;
    page: number;
  }): Promise<Song[]> {
    return axios
      .get(
        `https://api.genius.com/artists/${artistId}/songs?sort=popularity&per_page=50&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )
      .then((response) => response.data.response.songs);
  }

  async getSongInfo(songId: number) {
    const song: Song = (
      await axios.get(`https://api.genius.com/songs/${songId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })
    ).data.response.song;

    return { title: song.title, artist: song.primary_artist.name };
  }

  async artistIdFromName(name: string): Promise<number | undefined> {
    try {
      const hits = (
        await axios.get(`https://api.genius.com/search?q=${name}`, {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        })
      ).data.response.hits;

      if (!hits.length || hits[0].type !== "song") {
        throw new Error(`no artist found for the name ${name}`);
      } else {
        return hits[0].result.primary_artist.id;
      }
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }

  async getSongLyric({
    title,
    artist,
  }: TitleArtist): Promise<string | undefined> {
    try {
      const options = {
        apiKey: this.apiKey,
        title,
        artist,
        optimizeQuery: true,
      };

      const response: string = await getLyrics(options);

      return !response ||
        response.includes("lyrics for this song have yet to be transcribed")
        ? undefined
        : response;
    } catch (err) {
      console.error(err);
      return undefined;
    }
  }
}

export const geniusClient = new GeniusApi(config.GENIUS_API_KEY);
