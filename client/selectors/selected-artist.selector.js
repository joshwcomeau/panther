import { createSelector } from 'reselect'
import presentVertex from './present-vertex.selector';

const artists = state => state.get('artists');

const selectedArtistSelector = createSelector(
  [ artists, presentVertex ],
  ( artists, presentVertex ) => {
    if ( !presentVertex ) return null;
    return artists.get(presentVertex.get('id'))
  }
);

export default selectedArtistSelector;
