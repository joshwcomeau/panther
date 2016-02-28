import { Map, List, fromJS } from 'immutable';
import faker from 'faker';

import {
  GRAVEYARD, PAST, PRESENT, FUTURE,
  getNodeIndex
} from '../helpers/nodes.duck.helpers';

// TEMPORARY. Just for development purposes.
import { nodesData } from '../temp_fixtures.js';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST = 'panther/nodes/SELECT_ARTIST';
const MARK_ARTIST_AS_SELECTED = 'panther/nodes/MARK_ARTIST_AS_SELECTED';
const POSITION_SELECTED_ARTIST_TO_CENTER = 'panther/nodes/POSITION_SELECTED_ARTIST_TO_CENTER';

///////////////////////////
// REDUCER ///////////////
/////////////////////////
export default function reducer(state = fromJS(nodesData), action) {
  switch (action.type) {
    case MARK_ARTIST_AS_SELECTED:
      const nodeIndex = getNodeIndex(state, action.node)

      if ( !nodeIndex ) {
        console.error(`Could not find index in MARK_ARTIST_AS_SELECTED. Looking for ${action.node}`)
      }

      return state
        .updateIn([FUTURE, 'nodes', selectedNodeIndex], node => (
          node.set('selected', true)
        ));

    case POSITION_SELECTED_ARTIST_TO_CENTER:
      // this will ultimately become more complex as API requests are integrated.
      // For now, we'll just:
      // - drop the first group (it's the graveyard)
      // - remove the non-clicked nodes
      // - add a new group of random nodes
      let newGroupId = state.get(-1).get('id') + 1;

      return state
        .delete(0)
        .updateIn([-2, 'nodes'], nodes => {
          return nodes.filter( node => {
            return action.node.get('name') === node.get('name')
          })
        })
        .setIn([-1, 'nodes'], fromJS([
          { name: faker.company.companyName() },
          { name: faker.internet.userName() },
          { name: faker.internet.userName() }
        ]))
        .push(fromJS({
          id: newGroupId,
          nodes: []
        }));

    default:
      return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////
export function selectArtist(node) {
  return {
    type: SELECT_ARTIST,
    node
  }
}

export function markArtistAsSelected(node) {
  console.log("Marking artists as selected", node)
  return {
    type: MARK_ARTIST_AS_SELECTED,
    node
  }
}

export function fetchArtistInfo() {

}

export function positionSelectedArtistToCenter() {
  return {
    type: POSITION_SELECTED_ARTIST_TO_CENTER
  }
}
