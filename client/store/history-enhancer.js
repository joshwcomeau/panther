import createHistory from 'history/lib/createBrowserHistory';

// TODO
// The basic idea here is we're wrapping our primary store with a History object.
// The history object is created with functions for handling new pieces of state,
// and can dispatch directly to the store.
//
// createHistoryStore(changeHandler)
// changeHandler invoked on every history change, with the `location` object
// as the first argument, and the store itself as the second object (For dispatching).
//
//

export default function pseudoRouter(changeHandler) {
  const history = createHistory();

  return createStore => (reducer, initialState) => {
    const store = createStore(reducer, initialState)

    // Create a clone of the original dispatcher functions
    const originalDispatcher = store.dispatch.bind(null)

    store.dispatch = action => {
      // If meta.history is provided, we need to update the URL
      if ( action.meta && action.meta.history ) {
        const { type, path } = action.meta.history;

        switch ( type ) {
          case 'push':
            history.push(path);
            break;
          // TODO: Support other types?
        }
      }

      // Pass the result along to the regular dispatcher.
      // (This new method is simply an enhancer,
      // it does not alter the original behaviour).
      return originalDispatcher(action);
    }


    // Attach our listener
    // This is how we make our redux state dependent on our history state.
    // The user-supplied changeHandler function receives all the info it needs
    // about the new location, as well as direct access to the store,
    // for dispatching and querying.
    history.listen( location => changeHandler(location, store) )

    return store;
  }
}
