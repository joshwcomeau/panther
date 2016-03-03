import { Map, List, fromJS } from 'immutable';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import faker from 'faker';

import {
  GRAVEYARD, PAST, PRESENT, FUTURE, WOMB,
  findNodeGroupById, findPathToNode
} from '../helpers/graph.duck.helpers';
import { findCenterOfNode } from '../helpers/position.helpers';

// TEMPORARY. Just for development purposes.
import { nodesData } from '../temp_fixtures.js';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST = 'panther/nodes/SELECT_ARTIST';
const MARK_UNCLICKED_ARTISTS_AS_REJECTED = 'panther/nodes/MARK_UNCLICKED_ARTISTS_AS_REJECTED';
const POSITION_SELECTED_ARTIST_TO_CENTER = 'panther/nodes/POSITION_SELECTED_ARTIST_TO_CENTER';
const UPDATE_NODE_POSITIONS = 'panther/nodes/UPDATE_NODE_POSITIONS';

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
          { id: faker.random.number().toString(), name: faker.company.companyName() },
          { id: faker.random.number().toString(), name: faker.internet.userName() },
          { id: faker.random.number().toString(), name: faker.internet.userName() }
        ]))
        .push(fromJS({
          id: nextGroupId,
          nodes: []
        }));

      return state.set('nodeGroups', nodeGroups);

    case UPDATE_NODE_POSITIONS:
      action.positions.forEach( position => {
        const { id, coordinates } = position;
        const { x, y } = coordinates;

        const [ groupIndex, nodeIndex ] = findPathToNode(state, id);
        if ( groupIndex === undefined || nodeIndex === undefined ) return;

        const fullPath = ['nodeGroups', groupIndex, 'nodes', nodeIndex];

        state = state.updateIn(fullPath, node => {
          return node.set('x', x).set('y', y)
        });
      });

      return state;

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

export function updateNodePositions() {
  // Sadly, I have to break out of React's lovely declarative abstraction here.
  // I need to access the DOM and find all currently-existing nodes. Their IDs
  // should be available as a data attribute, and I can find them by their classes.
  const domNodes = document.querySelectorAll('.node');
  const positions = Array.prototype.reduce.call(domNodes, (acc, node) => {
    console.log("Accumulating", acc)
    acc.push({
      id:           node.getAttribute('data-id'),
      coordinates:  findCenterOfNode(node)
    });

    return acc;
  }, []);


  return {
    type: UPDATE_NODE_POSITIONS,
    positions
  }


  // Ok, so this is all pretty fucked. Instead of zipping everything together,
  // Why don't we just extract a list of node IDs and a list of element coords,
  // separately, and combine.

  // const nodeIds = elements
  //   .map( element => element.props.nodes )
  //   .reduce( (memo, nodes) => {
  //     nodes.forEach( node => { memo.push(node.get('id')) });
  //
  //     return memo;
  //   }, []);
  //
  //
  // const elementCoordinates = domNodes
  //   .map( node => node.childNodes )
  //   .reduce( (memo, nodes) => {
  //     Array.prototype.forEach.call(nodes, node => {
  //       memo.push( findCenterOfNode(node) )
  //     });
  //
  //     return memo;
  //   }, []);
  //
  //
  // const positions = zip(nodeIds, elementCoordinates);
  // console.log(positions);
  //
  // return {
  //   type: UPDATE_NODE_POSITIONS,
  //   positions
  // }
}

export function fetchArtistInfo() {

}

export function positionSelectedArtistToCenter() {
  return {
    type: POSITION_SELECTED_ARTIST_TO_CENTER
  }
}
