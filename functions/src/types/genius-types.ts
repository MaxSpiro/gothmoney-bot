export type Artist = {
  id: string,
  name: string,
}
export type Song = {
  artist_names: string,
  full_title: string,
  lyrics_state: string,
  id: number,
  title: string,
  primary_artist: Artist,
}

export type TitleArtist ={
  title: string,
  artist: string
}

export type ArtistSearch = {
  artistName: string,
  nSongs: number,
  searchTerms?: string
}

