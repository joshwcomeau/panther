import { Map, fromJS } from 'immutable';

import historyEnhancer        from '../store/history-enhancer';
import { getArtistIdFromUrl } from '../helpers/url.helpers';
import { restart }            from '../ducks/app.duck';
import {
  selectArtist,
  restoreGraphState
} from '../ducks/graph.duck';


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
      store.dispatch(restoreGraphState());
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
