import { Map, List, fromJS } from 'immutable';
import faker from 'faker';


// TEMPORARY. Just for development purposes.
import { nodesData } from '../temp_fixtures.js';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST          = 'panther/nodes/SELECT_ARTIST';
export const CLICK_NODE             = 'panther/nodes/CLICK_NODE';
export const FADE_AND_REMOVE_NODES  = 'panther/nodes/FADE_AND_REMOVE_NODES';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
export default function reducer(state = fromJS(nodesData), action) {
  switch (action.type) {
    case FADE_AND_REMOVE_NODES:
      return state;

    case CLICK_NODE:
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
// ACTIONS ///////////////
/////////////////////////
export function clickNode(node) {
  return {
    type: CLICK_NODE,
    node: node
  };
}

export function fadeAndRemoveNodes(clickedNode) {
  return {
    type: FADE_AND_REMOVE_NODES,
    node: clickedNode
  }
}

export function fetchArtistInfo() {

}
