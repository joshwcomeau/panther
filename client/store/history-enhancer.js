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
  return createStore => (reducer, initialState) => {
    const store = createStore(reducer, initialState)

    // Create a clone of the original dispatcher functions
    const originalDispatcher = store.dispatch.bind(null)

    // If meta.history is provided, we need to update the URL with the supplied value.
    store.dispatch = (action) => {
      console.log("Dispatching action", action)
      return originalDispatcher(action);
    }

    return store;
  }
}
