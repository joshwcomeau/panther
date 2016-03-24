import { createSelector } from 'reselect'
import selectedArtist from './selected-artist.selector';

const status    = state => state.getIn(['graph', 'status']);

const artistVisibleSelector = createSelector(
  [ status, selectedArtist ],
  ( status, selectedArtist ) => status !== 'repositioning' && !!selectedArtist
);

export default artistVisibleSelector;
