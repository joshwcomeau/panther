import { createSelector } from 'reselect'

const artists = state => state.get('artists');
const selectedVertex = state => {
  console.log("Selected running, got", state.get('graph'))
  return state.get('graph').get('selected');
}

const selectedArtistSelector = createSelector(
  [ artists, selectedVertex ],
  ( artists, selectedVertex ) => {
    console.log("Getting selected artist", selectedVertex, artists && artists.get(selectedVertex))
    if ( !selectedVertex ) return null;

    return artists.get(selectedVertex)
  }
);

export default selectedArtistSelector;
