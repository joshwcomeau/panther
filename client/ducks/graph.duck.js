import { Map, List, fromJS } from 'immutable';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import faker from 'faker';

import {
  GRAVEYARD, PAST, PRESENT, FUTURE, WOMB,
  findNodeGroupById, findPathToNode, findCoordinatesForNodes
} from '../helpers/graph.duck.helpers';

// TEMPORARY. Just for development purposes.
import { nodesData } from '../temp_fixtures.js';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST = 'panther/nodes/SELECT_ARTIST';
const MARK_UNCLICKED_ARTISTS_AS_REJECTED = 'panther/nodes/MARK_UNCLICKED_ARTISTS_AS_REJECTED';
const POSITION_SELECTED_ARTIST_TO_CENTER = 'panther/nodes/POSITION_SELECTED_ARTIST_TO_CENTER';
const CALCULATE_AND_EXPAND_EDGES = 'panther/edges/CALCULATE_AND_EXPAND_EDGES';
const RETRACT_EDGES = 'panther/edges/RETRACT_EDGES';

///////////////////////////
// REDUCER ///////////////
/////////////////////////
export default function reducer(state = fromJS(nodesData), action) {
  switch (action.type) {
    case MARK_UNCLICKED_ARTISTS_AS_REJECTED:
      // Update the nodes themselves with a `rejected` property
      state = state.updateIn(['nodeGroups', FUTURE, 'nodes'], nodes => {
        return nodes.map( (node, index) => {
          return node.get('id') !== action.node.get('id')
            ? node.set( 'rejected', true )
            : node;
        });
      });

      // Next, find all affected edges and set them as retracting
      // If we don't have any edges, we can skip this bit.
      if ( !state.get('edges') || !state.get('edges').size ) return state;

      const rejectedNodeIds = state
        .getIn( ['nodeGroups', FUTURE, 'nodes'] )
        .filter( node => node.get('rejected') )
        .map( node => node.get('id'));

      return state.update('edges', edges => {
        return edges.map( edge => {
          const connectsToRejectedNode = rejectedNodeIds.indexOf(edge.get('toNodeId')) !== -1;

          return edge
            .set('expanding', false)
            .set('retracting', connectsToRejectedNode);
        });
      });

    case POSITION_SELECTED_ARTIST_TO_CENTER:
      // - drop the first group (it's the graveyard)
      // - add a new group of random nodes
      // - set the clicked node to 'pulling'
      const nextGroupId = state.getIn(['nodeGroups', WOMB, 'id']) + 1;

      const numOfFutureNodes = Math.floor(Math.random() * 4)+2;
      let futureNodes = [];
      for ( let i=0; i<numOfFutureNodes; i++ ) {
        futureNodes.push({
          id: faker.random.number().toString(),
          name: faker.company.companyName()
        })
      }

      state = state.update('nodeGroups', nodeGroups => {
        return nodeGroups
          .delete(GRAVEYARD)
          .updateIn([PRESENT, 'nodes'], nodes => {
            return nodes.filter( node => !node.get('rejected'))
          })
          .setIn([FUTURE, 'nodes'], fromJS(futureNodes))
          .push(fromJS({
            id: nextGroupId,
            nodes: []
          }));
      });

      // If we don't have any edges, we can skip this bit.
      if ( !state.get('edges') || !state.get('edges').size ) return state;

      const selectedNodeId = state.getIn(['nodeGroups', PRESENT, 'nodes', '0', 'id']);

      return state.update('edges', edges => {
        return edges.map( edge => (
          edge.set('pulling', edge.get('toNodeId') === selectedNodeId)
        ));
      });


    case CALCULATE_AND_EXPAND_EDGES:
      let edges = [];
      const groups = state.get('nodeGroups');

      groups.forEach( (group, groupIndex) => {
        // We're making lines, essentially. One line per node for each node in the
        // NEXT group.
        // eg:
        //     /-----> o
        //    /
        //   o -------> o
        //
        // Because there is 1 node in this group and two nodes in the next group,
        // we need (1 * 2 = 2) edges.

        // If this group has 0 nodes, we can return
        if ( !group.get('nodes') || !group.get('nodes').size ) return;

        const nextGroup = groups.get(groupIndex+1);

        // If this is the final group, no edges are necessary.
        if ( !nextGroup ) return;

        group.get('nodes').forEach( node => {
          nextGroup.get('nodes').forEach( nextNode => {

            // Find the coordinate pair for both nodes.
            const nodeCoords = action.positions[node.get('id')];
            const nextNodeCoords = action.positions[nextNode.get('id')];

            // If the nodes don't have coordinates, don't include the edges.
            if ( !nextNodeCoords || !nextNodeCoords.y ) return;

            // We want to expand present-to-future edges


            edges.push({
              x1:         nodeCoords.x,
              y1:         nodeCoords.y,
              x2:         nextNodeCoords.x,
              y2:         nextNodeCoords.y,
              fromNodeId: node.get('id'),
              toNodeId:   nextNode.get('id'),
              expanding:  groupIndex === PRESENT
            });
          });
        });
      });

      return state.set('edges', fromJS(edges));

    default:
      return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////

// This is our orchestration action that is caught by the Saga.
// It does not have any direct effect on the state.
export function selectArtist(node) {
  return {
    type: SELECT_ARTIST,
    node
  }
}

// This action makes the non-selected artists disappear.
export function markUnclickedArtistsAsRejected(node) {
  return {
    type: MARK_UNCLICKED_ARTISTS_AS_REJECTED,
    node
  }
}

// This action retracts the edges from rejected artists.
export function retractEdges() {
  return {
    type: RETRACT_EDGES
  };
}

export function calculateAndExpandEdges() {
  // Sadly, I have to break out of React's lovely declarative abstraction here.
  // I need to access the DOM and find all currently-existing nodes. Their IDs
  // should be available as a data attribute, and I can find them by their classes.
  //
  // Doing this outside the reducer because it relies on the DOM.
  const positions = findCoordinatesForNodes();

  return {
    type: CALCULATE_AND_EXPAND_EDGES,
    positions
  };
}

export function fetchArtistInfo() {

}

export function positionSelectedArtistToCenter() {
  return {
    type: POSITION_SELECTED_ARTIST_TO_CENTER
  }
}
