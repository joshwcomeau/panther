import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware                  from 'redux-thunk';
import createSagaMiddleware             from 'redux-saga'

import rootReducer                      from '../reducers';
import { clickNode }                    from '../sagas';


export default function configureStore() {
  let middlewares = [];
  middlewares.push( createSagaMiddleware(clickNode) );
  middlewares.push( thunkMiddleware );

  return createStore(
    rootReducer,
    applyMiddleware.apply(null, middlewares)
  );
}
