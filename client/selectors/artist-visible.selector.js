import { createSelector } from 'reselect'
import selectedArtist from './selected-artist.selector';

const isRepositioning = state => state.getIn(['graph', 'repositioning']);
const isLoading = state => state.getIn(['graph', 'loading']);


const artistVisibleSelector = createSelector(
  [ isRepositioning, isLoading, selectedArtist ],
  ( isRepositioning, isLoading, selectedArtist ) => (
    !isRepositioning && !isLoading && !!selectedArtist
  )
);

export default artistVisibleSelector;
