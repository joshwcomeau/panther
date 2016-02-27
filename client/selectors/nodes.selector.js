import { createSelector }     from 'reselect';
import { Map, List, fromJS }  from 'immutable';
import _                      from 'lodash';


// We want to wrap our 4 categories of nodes into a single 2D array.
// This way we can iterate through them in the components.

const nodeSelector = state => fromJS([
  [ state.get('nodes').get('graveyard') ],
  [ state.get('nodes').get('past') ],
  [ state.get('nodes').get('present') ],
  state.get('nodes').get('future')      // `future` is already an array
]);

const selector = createSelector(nodeSelector, (nodes) => {
  return { nodes };
});

export default selector;
