import { createHistory } from 'history';


const history = createHistory();


const historyMiddleware = store => next => action => {
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

export default historyMiddleware;
