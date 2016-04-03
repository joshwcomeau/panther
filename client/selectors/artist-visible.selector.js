import { createSelector } from 'reselect'
import selectedArtist from './selected-artist.selector';

const isRepositioning = state => state.getIn(['graph', 'repositioning']);

const artistVisibleSelector = createSelector(
  [ isRepositioning, selectedArtist ],
  ( isRepositioning, selectedArtist ) => !isRepositioning && !!selectedArtist
);

export default artistVisibleSelector;
