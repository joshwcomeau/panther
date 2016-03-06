import { createStore, applyMiddleware, compose }  from 'redux';
import thunkMiddleware                            from 'redux-thunk';
import createSagaMiddleware                       from 'redux-saga'

import rootReducer            from '../reducers';
import { watchSelectArtist }  from '../sagas/select_artist.saga';
import spotifyMiddleware      from '../middlewares/spotify';
import DevTools               from '../containers/DevTools.jsx';


export default function configureStore() {
  // On the client, we pass in an array of sockets.
  // We will create one middleware step for each one.
  // When actions are dispatched, each middleware will check its middleware.
  // if the action has specified its namespace as a remote, the socket will
  // emit an action on that socket with the action data, along with some
  // mixed-in extras (like the current user's auth data.)


  let middlewares = [];
  middlewares.push( createSagaMiddleware(watchSelectArtist) );
  middlewares.push( spotifyMiddleware );
  middlewares.push( thunkMiddleware );

  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware.apply(this, middlewares),
      DevTools.instrument()
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    });
  }

  // Allow direct access to the store, for debugging/testing
  window.__store = store;

  return store
}
