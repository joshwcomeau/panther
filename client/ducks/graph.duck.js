import { Map, List, fromJS } from 'immutable';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import faker from 'faker';

import {
  GRAVEYARD, PAST, PRESENT, FUTURE, WOMB,
  findNodeGroupById, findPathToNode, findCoordinatesForEdges
} from '../helpers/graph.duck.helpers';



///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST                = 'SELECT_ARTIST';
const SETUP_INITIAL_STAGE                 = 'SETUP_INITIAL_STAGE';
const MARK_UNCLICKED_ARTISTS_AS_REJECTED  = 'MARK_UNCLICKED_ARTISTS_AS_REJECTED';
const RETRACT_REJECTED_NODE_EDGES         = 'RETRACT_REJECTED_NODE_EDGES';
const REMOVE_REJECTED_ARTISTS             = 'REMOVE_REJECTED_ARTISTS';
const RETRACT_SELECTED_NODE_EDGE          = 'RETRACT_SELECTED_NODE_EDGE';
const POSITION_SELECTED_ARTIST_TO_CENTER  = 'POSITION_SELECTED_ARTIST_TO_CENTER';
const CALCULATE_AND_EXPAND_EDGES          = 'CALCULATE_AND_EXPAND_EDGES';
const POPULATE_RELATED_ARTIST_NODES       = 'POPULATE_RELATED_ARTIST_NODES';
const TAKE_SNAPSHOT_OF_STATE              = 'TAKE_SNAPSHOT_OF_STATE';
const RESTORE_PREVIOUS_NODE_STATE         = 'RESTORE_PREVIOUS_NODE_STATE';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
// TEMPORARY. Just for development purposes.
import { nodesData } from '../temp_fixtures.js';
// const initialState = fromJS(nodesData);
const initialState = Map();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SETUP_INITIAL_STAGE:
      // The first thing we need is our 5 areas.
      // We don't have a future yet (a saga is concurrently working on it),
      // but we can prepare the stage in the meantime.
      let nodeGroups = Array.from(new Array(5), (group, id) => ({
        id,
        nodes: []
      }));

      nodeGroups[PRESENT].nodes.push(action.artist);

      return state.set('nodeGroups', fromJS(nodeGroups));

    case MARK_UNCLICKED_ARTISTS_AS_REJECTED:
      return state.updateIn(['nodeGroups', FUTURE, 'nodes'], nodes => (
        nodes.map( (node, index) => {
          console.log(node, action.node)
          return node.set( 'rejected', node.get('id') !== action.node.get('id') )
        })
      ));

    case RETRACT_REJECTED_NODE_EDGES:
      // Find all edges connected to rejected nodes and retract them.
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
        nodes.concat( fromJS(action.relatedArtists) )
      ));

    case POSITION_SELECTED_ARTIST_TO_CENTER:
    // What needs to happen here will depend on the direction specified.
      const nextGroupId = state.getIn(['nodeGroups', WOMB, 'id']) + 1;

      return state.update('nodeGroups', nodeGroups => {
        const newWomb = fromJS({ id: nextGroupId, nodes: List() });

        return nodeGroups.delete(GRAVEYARD).push(newWomb);
      })


    case RETRACT_SELECTED_NODE_EDGE:
      // If we don't have any edges, we can skip this bit.
      if ( !state.get('edges') || !state.get('edges').size ) return state;

      const selectedNodeId = state.getIn(['nodeGroups', FUTURE, 'nodes', '0', 'id']);

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


    case RESTORE_PREVIOUS_NODE_STATE:
      // Simple undo, reverts the nodes and edges from the previous state.
      const previousState = state.getIn(['history', -1]);

      return state
        .set('nodeGroups', previousState.get('nodeGroups'))
        // Remove this previous state from the history; it's been consumed.
        .update('history', history => history.pop());


    case TAKE_SNAPSHOT_OF_STATE:
      // Create a fresh history if none exists
      if ( !state.get('history') ) state = state.set('history', List());

      return state.update('history', history => (
        history.push(Map({
          nodeGroups: state.get('nodeGroups'),
          edges:      state.get('edges'),
        }))
      ));

    default:
      return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////

// This is our orchestration action that is caught by the Saga.
// It does not have any direct effect on the state.
export function selectArtist(artist, direction) {
  return {
    type: SELECT_ARTIST,
    artist,
    direction
  };
}

export function setupInitialStage(artist) {
  return {
    type: SETUP_INITIAL_STAGE,
    artist
  }
}

// This action makes the non-selected artists disappear.
export function markUnclickedArtistsAsRejected(node) {
  return {
    type: MARK_UNCLICKED_ARTISTS_AS_REJECTED,
    node
  };
}

export function calculateAndExpandEdges() {
  // Sadly, I have to break out of React's lovely declarative abstraction here.
  // I need to access the DOM and find all currently-existing nodes. Their IDs
  // should be available as a data attribute, and I can find them by their classes.
  //
  // Doing this outside the reducer because it relies on the DOM.
  const positions = findCoordinatesForEdges();

  return {
    type: CALCULATE_AND_EXPAND_EDGES,
    positions
  };
}

export function retractRejectedNodeEdges() {
  return { type: RETRACT_REJECTED_NODE_EDGES };
}

export function retractSelectedNodeEdge() {
  return { type: RETRACT_SELECTED_NODE_EDGE };
}

export function populateRelatedArtistNodes(relatedArtists) {
  return {
    type: POPULATE_RELATED_ARTIST_NODES,
    relatedArtists
  };
}

export function removeRejectedArtists() {
  return { type: REMOVE_REJECTED_ARTISTS };
}

export function positionSelectedArtistToCenter() {
  return { type: POSITION_SELECTED_ARTIST_TO_CENTER };
}

export function restorePreviousNodeState() {
  return { type: RESTORE_PREVIOUS_NODE_STATE };
}

export function takeSnapshotOfState() {
  return { type: TAKE_SNAPSHOT_OF_STATE };
}
