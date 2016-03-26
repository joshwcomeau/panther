import { Map, List, fromJS } from 'immutable';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import faker from 'faker';

import { CATACOMBS, GRAVEYARD, PAST, PRESENT, FUTURE } from '../config/regions';
import {
  getPreviousRegion, recalculateEdges
} from '../helpers/graph.helpers';

///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST                  = 'SELECT_ARTIST';
export const SETUP_INITIAL_STAGE            = 'SETUP_INITIAL_STAGE';
export const UPDATE_REPOSITION_STATUS       = 'UPDATE_REPOSITION_STATUS';
export const ADD_RELATED_ARTISTS_TO_GRAPH   = 'ADD_RELATED_ARTISTS_TO_GRAPH';
export const CENTER_GRAPH_AROUND_VERTEX     = 'CENTER_GRAPH_AROUND_VERTEX';
export const MARK_VERTEX_AS_SELECTED        = 'MARK_VERTEX_AS_SELECTED';
export const CAPTURE_GRAPH_STATE            = 'CAPTURE_GRAPH_STATE';
export const RESTORE_GRAPH_STATE            = 'RESTORE_GRAPH_STATE';
export const EMPTY_GRAPH                    = 'EMPTY_GRAPH';

///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = fromJS({
  vertices: [],
  edges: [],
  selected: null
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SETUP_INITIAL_STAGE:
    const initialVertices = fromJS([{
      id:           action.artist.get('id'),
      region:       PRESENT,
      regionIndex:  1
    }])

    return state
      .set('vertices', initialVertices)
      .set('edges', List())
      .set('status', 'idle');

  case UPDATE_REPOSITION_STATUS:
    return state.set('status', action.status);

  case ADD_RELATED_ARTISTS_TO_GRAPH:
    return state
      .update('vertices', vertices => {
        // Create a new vertex for each related artist
        const newVertices = fromJS(action.artists.map( (artist, i) => ({
          id:           artist.id,
          region:       FUTURE,
          regionIndex:  i
        })));

        return vertices.concat(newVertices);
      })
      .update('edges', edges => {
        // Find the 'present' artist's ID
        const from = state
          .get('vertices')
          .find( v => v.get('region') === PRESENT )
          .get('id');

        // Create a new edge for each related artist
        const newEdges = fromJS(action.artists.map( artist => ({
          from,
          to: artist.id
        })));

        return edges.concat(newEdges);
      })
      .set('status', 'adding-related-artists');


  case CENTER_GRAPH_AROUND_VERTEX:
    // Few orders of business here:
    // - Remove unclicked vertices in FUTURE
    // - Remove the graveyard vertex, if applicable
    // - Move everything down (PRESENT -> PAST, PAST -> GRAVEYARD)
    // - Ensure that our FUTURE-PRESENT node has the right regionIndex (1)
    // - Recalculate edges
    const id = action.artist.get('id');

    state = state
      .update('vertices', vertices => (
        vertices
          .filter( vertex => (
            vertex.get('id') === id
            ||
            ( vertex.get('region') !== FUTURE && vertex.get('region') !== CATACOMBS )
          ))
          .map( vertex => (
            vertex.update('region', getPreviousRegion)
          ))
          .setIn([-1, 'regionIndex'], 1)
      ));

    return state
      .update('edges', edges => recalculateEdges(state.get('vertices')))
      .set('status', 'repositioning');

  case MARK_VERTEX_AS_SELECTED:
    return state.set('selected', action.artist.get('id'));

  case CAPTURE_GRAPH_STATE:
    return state.set('history', state);

  case RESTORE_GRAPH_STATE:
    const formerSelected = state.get('selected')
    return state
      .get('history')
      .set('selected', formerSelected)
      .set('status', 'repositioning');

  case EMPTY_GRAPH:
    return initialState;

  default:
    return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////

export function selectArtist(artist) {
  return {
    type: SELECT_ARTIST,
    artist
  };
}

export function setupInitialStage(artist) {
  return {
    type: SETUP_INITIAL_STAGE,
    artist
  };
}

export function updateRepositionStatus(status) {
  return {
    type: UPDATE_REPOSITION_STATUS,
    status
  };
}

export function addRelatedArtistsToGraph(artists) {
  return {
    type: ADD_RELATED_ARTISTS_TO_GRAPH,
    artists
  };
}

export function centerGraphAroundVertex(artist) {
  return {
    type: CENTER_GRAPH_AROUND_VERTEX,
    artist
  };
}

export function markVertexAsSelected(artist) {
  return {
    type: MARK_VERTEX_AS_SELECTED,
    artist
  };
}

export function captureGraphState() {
  return { type: CAPTURE_GRAPH_STATE };
}

export function restoreGraphState() {
  return { type: RESTORE_GRAPH_STATE };
}

export function emptyGraph() {
  return { type: EMPTY_GRAPH };
}
