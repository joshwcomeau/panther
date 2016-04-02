import { createStore, applyMiddleware, compose }  from 'redux';
import thunkMiddleware                            from 'redux-thunk';
import createSagaMiddleware                       from 'redux-saga'

import rootReducer                    from '../reducers';
import { watchSelectArtist }          from '../sagas/select_artist.saga';
import { search }                     from '../sagas/search.saga';
import { restart }                    from '../sagas/restart.saga';
import artistHistoryEnhancer          from '../enhancers/artist-history.enhancer';

export default function configureStore() {
  const middlewares = [
    thunkMiddleware,
    createSagaMiddleware(watchSelectArtist),
    createSagaMiddleware(search),
    createSagaMiddleware(restart)
  ];

  return createStore(
    rootReducer,
    compose(
      artistHistoryEnhancer,
      applyMiddleware.apply(null, middlewares)
    )
  );
}
