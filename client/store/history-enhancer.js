import createHistory from 'history/lib/createBrowserHistory';


// TODO: Extract me into my own module!
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
