import { createSelector } from 'reselect'
import selectedArtist from './selected-artist.selector';

const selected  = state => state.getIn(['graph', 'selected']);
const status    = state => state.getIn(['graph', 'status']);

export const artistVisibleSelector = createSelector(
  [ status ],
  ( status ) => status !== 'repositioning'
);

export const imagesSelector = createSelector(
  [ selectedArtist ],
  ( selectedArtist ) => selectedArtist ? selectedArtist.get('images') : null
);
