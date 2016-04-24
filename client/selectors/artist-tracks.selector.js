import { createSelector } from 'reselect'

const artistId = state => state.getIn(['samples', 'selectedArtistId']);
const tracks = state => state.getIn(['samples', 'tracks']);


const artistVisibleSelector = createSelector(
  [ artistId, tracks ],
  ( artistId, tracks ) => (
    artistId ? tracks.get(artistId) : []
  )
);

export default artistVisibleSelector;
