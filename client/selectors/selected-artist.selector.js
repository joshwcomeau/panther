import { createSelector } from 'reselect'

const artists = state => state.get('artists');
const selectedVertex = state => state.get('graph').get('selected');

const selectedArtistSelector = createSelector(
  [ artists, selectedVertex ],
  ( artists, selectedVertex ) => {
    if ( !selectedVertex ) return null;

    return artists.get(selectedVertex)
  }
);

export default selectedArtistSelector;
