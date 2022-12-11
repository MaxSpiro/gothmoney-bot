import axios from "axios";
import { GeniusApi } from "../clients/genius-client";
import { getRandomEmojis } from "../helpers/emoji";
import { LINES_PER_LYRIC } from "../settings/artists";
import { musicEmoji } from "../settings/emoji";
import { ArtistSearch, Song, TitleArtist } from "../types/genius-types";

export class GeniusService {
  constructor(private readonly geniusClient: GeniusApi) {}

  async getAllSongIds(artists: ArtistSearch[]): Promise<number[]> {
    let completeSongs: number[] = [];
    try {
      for (const { artistName, nSongs, searchTerms } of artists) {
        let thisArtistSongs: number[] = [];
        let page = 1;
        const artistId = await this.geniusClient.artistIdFromName(
          artistName + (searchTerms ? ` ${searchTerms}` : "")
        );
        if (!artistId) {
          continue;
        }
        while (thisArtistSongs.length < nSongs) {
          const pageSongs = await this.geniusClient.getArtistSongs({
            artistId,
            page,
          });

          if (!pageSongs.length) {
            break;
          }
          thisArtistSongs = thisArtistSongs.concat(
            pageSongs
              .filter((song) => {
                const complete = song.lyrics_state === "complete";
                const mainArtist = song.primary_artist.name.toLowerCase();

                return (
                  complete && mainArtist.includes(artistName.toLowerCase())
                );
              })
              .map((song) => {
                return song.id;
              })
          );
          page++;
        }
        completeSongs = completeSongs.concat(thisArtistSongs);
      }
    } catch (err) {
      console.error(err);
    }
    return completeSongs;
  }

  private async getRandomSnippetFromLyrics(
    songId: number,
    numLines = LINES_PER_LYRIC
  ) {
    const { title, artist } = await this.geniusClient.getSongInfo(songId);

    let lyrics: string | undefined = await this.geniusClient.getSongLyric({
      title,
      artist,
    });

    if (!lyrics) {
      return undefined;
    }

    if (lyrics.includes("[Intro")) {
      lyrics = lyrics.substring(
        lyrics.indexOf("\n", lyrics.indexOf("[Intro")) + 1
      );
    }

    const lines: string[] = lyrics
      .split("\n")
      .filter((line) => line && !/^\[.*\]$/.test(line));
    const multiples: number[] = [0];
    for (let i = numLines; i < lines.length - numLines; i += numLines) {
      multiples.push(i);
    }
    const index: number =
      multiples[Math.floor(Math.random() * multiples.length)];
    const text: string = lines.slice(index, index + numLines).join("\n");

    return text;
  }

  async generateSnippet(songIds: number[]): Promise<string | undefined> {
    const songId = songIds[Math.floor(Math.random() * songIds.length)];

    const { title, artist } = await this.geniusClient.getSongInfo(songId);
    const snippet = await this.getRandomSnippetFromLyrics(songId);
    if (snippet) {
      return (
        snippet +
        getRandomEmojis() +
        "\n" +
        `${musicEmoji}${title.toLowerCase()} - ${artist.toLowerCase()}${musicEmoji}`
      );
    }
  }
}
