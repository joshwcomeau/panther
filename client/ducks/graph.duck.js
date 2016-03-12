import { Map, List, fromJS } from 'immutable';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import faker from 'faker';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST                  = 'SELECT_ARTIST';
export const SETUP_INITIAL_STAGE            = 'SETUP_INITIAL_STAGE';
export const MARK_ARTISTS_AS_REJECTED       = 'MARK_ARTISTS_AS_REJECTED';
export const UPDATE_VERTEX_POSITIONS        = 'UPDATE_VERTEX_POSITIONS';
export const ADD_RELATED_ARTISTS            = 'ADD_RELATED_ARTISTS';
export const POPULATE_RELATED_ARTIST_NODES  = 'POPULATE_RELATED_ARTIST_NODES';
export const UPDATE_REPOSITION_STATUS       = 'UPDATE_REPOSITION_STATUS';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
// TEMPORARY. Just for development purposes.
import { vertexData } from '../temp_fixtures.js';
const initialState = fromJS(vertexData);
// const initialState = Map();

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SETUP_INITIAL_STAGE:
    // TBD
    return state;

  case UPDATE_REPOSITION_STATUS:
    // sets the status to `idle`, `setup`, 'repositioning', 'cleanup'.

  case MARK_ARTISTS_AS_REJECTED:
    // The idea here is when we click a node, the un-clicked future nodes
    // are no longer required. We mark them as rejected, so that they can
    // fade away and their edge can retract.
    return state;

  case UPDATE_VERTEX_POSITIONS:
    // This is our queue to update our vertex/edge state to match the new
    // reality. We just marked our artists as rejected and waited for the
    // edges to retract and vertices to disappear, and now it's time to
    // replace the old state with the new, so that the nodes can animate to
    // their new positions.
    return state;

  case ADD_RELATED_ARTISTS:
    // Fired when both UPDATE_VERTEX_POSITIONS is completed and the data
    // from the Spotify API is completed,

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
