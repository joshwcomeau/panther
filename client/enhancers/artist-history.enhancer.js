import { Map, fromJS } from 'immutable';

import historyEnhancer        from '../store/history-enhancer';
import { getArtistIdFromUrl } from '../helpers/url.helpers';
import { restart }            from '../ducks/app.duck';
import {
  selectArtist,
  restoreGraphState,
  updateRepositionStatus
} from '../ducks/graph.duck';
import {
  stop,
  selectArtistForTracks
} from '../ducks/samples.duck';

function historyChange(location, store) {
  const artistId = getArtistIdFromUrl(location.pathname);

  if ( artistId ) {
    // Figure out which direction we're moving in.
    // This can be determined, for now, by whether the node is in the FUTURE or PAST.
    // Eventually, I should ditch this whole idea of restoring graph state,
    // and just make the selectArtist saga smarter :)
    const vertices = store.getState().getIn(['graph', 'vertices']);
    const vertex = vertices.find( vertex => vertex.get('id') === artistId );
    const region = vertex ? vertex.get('region') : null;

    if ( region === 'PAST' ) {
      // If a track is still playing, we need to stop it
      if ( store.getState().getIn(['samples', 'playing']) ) {
        store.dispatch(stop());
      }

      store.dispatch(selectArtistForTracks(artistId));

      store.dispatch(restoreGraphState());
      store.dispatch(updateRepositionStatus(true));

    } else {
      // Transform the artistId into an immutable Map, to match the type expected.
      const artistPlaceholder = Map({
        id: artistId,
        type: 'placeholder'
      });

      store.dispatch(selectArtist(artistPlaceholder, false));
    }
  } else {
    store.dispatch(restart());
  }

}

export default historyEnhancer(historyChange);
