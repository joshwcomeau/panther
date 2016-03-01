import { Map, List, fromJS } from 'immutable';
import faker from 'faker';

import {
  GRAVEYARD, PAST, PRESENT, FUTURE, WOMB
} from '../helpers/graph.duck.helpers';

// TEMPORARY. Just for development purposes.
import { nodesData } from '../temp_fixtures.js';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST = 'panther/nodes/SELECT_ARTIST';
const MARK_UNCLICKED_ARTISTS_AS_REJECTED = 'panther/nodes/MARK_UNCLICKED_ARTISTS_AS_REJECTED';
const POSITION_SELECTED_ARTIST_TO_CENTER = 'panther/nodes/POSITION_SELECTED_ARTIST_TO_CENTER';

///////////////////////////
// REDUCER ///////////////
/////////////////////////
export default function reducer(state = fromJS(nodesData), action) {
  switch (action.type) {
    case MARK_UNCLICKED_ARTISTS_AS_REJECTED:
      return state.updateIn(['nodeGroups', FUTURE, 'nodes'], nodes => {
        return nodes.map( (node, index) => {
          return node.get('name') !== action.node.get('name')
            ? node.set( 'rejected', true )
            : node;
        });
      });

    case POSITION_SELECTED_ARTIST_TO_CENTER:
      // - drop the first group (it's the graveyard)
      // - remove the non-clicked nodes
      // - add a new group of random nodes
      const nextGroupId = state.getIn(['nodeGroups', WOMB, 'id']) + 1;

      const nodeGroups = state.get('nodeGroups')
        .delete(GRAVEYARD)
        .updateIn([PRESENT, 'nodes'], nodes => {
          return nodes.filter( node => !node.get('rejected'))
        })
        .setIn([FUTURE, 'nodes'], fromJS([
          { name: faker.company.companyName() },
          { name: faker.internet.userName() },
          { name: faker.internet.userName() }
        ]))
        .push(fromJS({
          id: nextGroupId,
          nodes: []
        }));

      return state.set('nodeGroups', nodeGroups);

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
  return {
    type: MARK_UNCLICKED_ARTISTS_AS_REJECTED,
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
