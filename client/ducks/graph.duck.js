import { Map, List, fromJS } from 'immutable';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import faker from 'faker';

import {
  GRAVEYARD, PAST, PRESENT, FUTURE, WOMB,
  findNodeGroupById, findPathToNode, findCoordinatesForNodes
} from '../helpers/graph.duck.helpers';



///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST = 'SELECT_ARTIST';
const MARK_UNCLICKED_ARTISTS_AS_REJECTED = 'MARK_UNCLICKED_ARTISTS_AS_REJECTED';
const POSITION_SELECTED_ARTIST_TO_CENTER = 'POSITION_SELECTED_ARTIST_TO_CENTER';
const CALCULATE_AND_EXPAND_EDGES = 'CALCULATE_AND_EXPAND_EDGES';
const POPULATE_RELATED_ARTIST_NODES = 'POPULATE_RELATED_ARTIST_NODES';
const REMOVE_REJECTED_ARTISTS = 'REMOVE_REJECTED_ARTISTS';



///////////////////////////
// REDUCER ///////////////
/////////////////////////
// TEMPORARY. Just for development purposes.
import { nodesData } from '../temp_fixtures.js';
const initialState = fromJS(nodesData);
// const initialState = Map();

export default function reducer(state = initialState, action) {
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

    case REMOVE_REJECTED_ARTISTS:
      // TODO: Could make this more efficient by only checking groups that
      // can have rejected nodes (PRESENT and WOMB)
      return state.update('nodeGroups', nodeGroups => (
        nodeGroups.map( group => (
          group.update('nodes', nodes => (
            nodes.filter( node => !node.get('rejected') )
          ))
        ))
      ));

    case POPULATE_RELATED_ARTIST_NODES:
      return state.updateIn(['nodeGroups', FUTURE, 'nodes'], nodes => (
        nodes.concat( action.nodes )
      ));

    case POSITION_SELECTED_ARTIST_TO_CENTER:
      // What needs to happen here will depend on the direction specified.

      let groupToDelete = action.direction === 'forwards' ? GRAVEYARD : WOMB;

      const nextGroupId = state.getIn(['nodeGroups', WOMB, 'id']) + 1;


      state = state.update('nodeGroups', nodeGroups => {
        return nodeGroups
          .delete(groupToDelete)
          .push(fromJS({ id: nextGroupId, nodes: List() }));
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

        // If this is the final group, or the next group is empty,
        // no edges are necessary.
        if ( !nextGroup || !nextGroup.size ) return;

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
export function selectArtist(node, direction) {
  return {
    type: SELECT_ARTIST,
    node,
    direction
  }
}

// This action makes the non-selected artists disappear.
export function markUnclickedArtistsAsRejected(node) {
  return {
    type: MARK_UNCLICKED_ARTISTS_AS_REJECTED,
    node
  }
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

export function populateRelatedArtistNodes() {
  const numOfFutureNodes = Math.floor(Math.random() * 4)+2;
  let nodes = [];
  for ( let i=0; i<numOfFutureNodes; i++ ) {
    nodes.push({
      id: faker.random.number().toString(),
      name: faker.company.companyName()
    })
  }

  nodes = fromJS(nodes);

  return {
    type: POPULATE_RELATED_ARTIST_NODES,
    nodes
  }
}

export function removeRejectedArtists() {
  return {
    type: REMOVE_REJECTED_ARTISTS
  }
}

export function positionSelectedArtistToCenter(direction) {
  return {
    type: POSITION_SELECTED_ARTIST_TO_CENTER,
    direction
  }
}
