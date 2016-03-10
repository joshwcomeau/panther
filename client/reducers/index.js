import { Map, List, fromJS } from 'immutable';

import graph from '../ducks/graph.duck';
import search from '../ducks/search.duck';
import samples from '../ducks/samples.duck';
import artistInfo from '../ducks/artist-info.duck';


const rootReducer = ( state = Map(), action ) => {
  return Map({
    // Each top-level key here has a child reducer that manages that part
    // of the state. These reducers are defined in their own files, and
    // they take their slice of the state, as well as the action invoked.
    graph: graph(
      state.get('graph'),
      action
    ),
    search: search(
      state.get('search'),
      action
    ),
    samples: samples(
      state.get('samples'),
      action
    ),
    artistInfo: artistInfo(
      state.get('artistInfo'),
      action
    )
  });
};

export default rootReducer
