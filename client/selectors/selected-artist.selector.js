import { createSelector } from 'reselect'
import presentVertex from './present-vertex.selector';

const artists = state => state.get('artists');

const selectedArtistSelector = createSelector(
  [ artists, presentVertex ],
  ( artists, presentVertex ) => {
    console.log("Selector running", artists.toJS(), presentVertex.toJS());
    if ( !presentVertex ) return null;
    return artists.find( artist => artist.get(presentVertex.get('id')) )
  }
);

export default selectedArtistSelector;
