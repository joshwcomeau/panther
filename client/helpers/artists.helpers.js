export function takeFirstFewUnseenArtists(relatedArtists, artistsInState) {
  let unseenArtists = [];

  while ( relatedArtists.length && unseenArtists.length < 3 ) {
    let artist = relatedArtists.shift()

    if ( !artistsInState.get(artist.id) ) unseenArtists.push(artist);
  }

  return unseenArtists;
}
