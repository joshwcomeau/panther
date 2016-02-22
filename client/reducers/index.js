import { Map, List, fromJS } from 'immutable';

import nodes from './nodes.reducer';


const rootReducer = ( state = Map(), action ) => {
  return Map({
    // Each top-level key here has a child reducer that manages that part
    // of the state. These reducers are defined in their own files, and
    // they take their slice of the state, as well as the action invoked.
    nodes: nodes(
      state.get('nodes'),
      action
    )
  });
};

export default rootReducer
