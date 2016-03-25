import { Map, fromJS } from 'immutable';

import historyEnhancer        from '../store/history-enhancer';
import { selectArtist }       from '../ducks/graph.duck';
import { getArtistIdFromUrl } from '../helpers/url.helpers';

function historyChange(location, store) {
  const artistId = getArtistIdFromUrl(location.pathname);

  // Transform the artistId into an immutable Map, to match the type expected.
  const artistPlaceholder = Map({
    id: artistId,
    type: 'placeholder'
  });

  store.dispatch(selectArtist(artistPlaceholder, false))
}

export default historyEnhancer(historyChange);
