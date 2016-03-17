import { createSelector } from 'reselect'
import selectedArtist from './selected-artist.selector';

const status    = state => state.getIn(['graph', 'status']);

export const artistVisibleSelector = createSelector(
  [ status, selectedArtist ],
  ( status, selectedArtist ) => status !== 'repositioning' && !!selectedArtist
);

export const imagesSelector = createSelector(
  [ selectedArtist ],
  ( selectedArtist ) => selectedArtist ? selectedArtist.get('images') : null
);
