import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware                  from 'redux-thunk';

import rootReducer                      from '../reducers';


export default function configureStore() {
  let middlewares = [];
  middlewares.push( thunkMiddleware );

  return createStore(
    rootReducer,
    applyMiddleware.apply(null, middlewares)
  );
}
