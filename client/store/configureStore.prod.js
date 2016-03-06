import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware                  from 'redux-thunk';
import createSagaMiddleware             from 'redux-saga'

import rootReducer                    from '../reducers';
import { watchSelectArtist }          from '../sagas/select_artist.saga';
import { watchInitializeWithArtist }  from '../sagas/initialize_with_artist.saga';
import spotifyMiddleware              from '../middlewares/spotify';


export default function configureStore() {
  let middlewares = [];
  middlewares.push( createSagaMiddleware(watchSelectArtist) );
  middlewares.push( createSagaMiddleware(watchInitializeWithArtist) );
  middlewares.push( spotifyMiddleware );
  middlewares.push( thunkMiddleware );

  return createStore(
    rootReducer,
    applyMiddleware.apply(null, middlewares)
  );
}
