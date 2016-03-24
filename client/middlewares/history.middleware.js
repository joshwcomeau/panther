import createHistory from 'history/lib/createBrowserHistory';

import { getArtistIdFromUrl } from '../helpers/url.helpers';
import { selectArtist } from '../ducks/graph.duck';


const history = createHistory();

const historyMiddleware = store => {
  // Setup custom listeners
  // TODO: Generalize this.

  history.listen( location => {
    const artistId = getArtistIdFromUrl(location.pathname);
    console.log("Got artistID", artistId)

    if ( artistId ) {
      store.dispatch(selectArtist(artistId, false))
    }
  })

  return next => action => {
    // Ignore actions that don't have history metadata.
    if ( !action.meta || !action.meta.history ) {
      return next(action);
    }

    const { type, path } = action.meta.history;

    switch ( type ) {
      case 'push':
        history.push(path)
    }

    return next(action);

  };
};

export default historyMiddleware;
