import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware                  from 'redux-thunk';
import createSagaMiddleware             from 'redux-saga'

import rootReducer            from '../reducers';
import { watchSelectArtist }  from '../sagas/select_artist.saga';


export default function configureStore() {
  let middlewares = [];
  middlewares.push( createSagaMiddleware(watchSelectArtist) );
  middlewares.push( thunkMiddleware );

  return createStore(
    rootReducer,
    applyMiddleware.apply(null, middlewares)
  );
}
