import { Map, List, fromJS } from 'immutable';
import zip from 'lodash/zip';
import flatten from 'lodash/flatten';
import faker from 'faker';

import { GRAVEYARD, PAST, PRESENT, FUTURE } from '../config/regions';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const SELECT_ARTIST                  = 'SELECT_ARTIST';
export const SETUP_INITIAL_STAGE            = 'SETUP_INITIAL_STAGE';
export const UPDATE_REPOSITION_STATUS       = 'UPDATE_REPOSITION_STATUS';
export const ADD_RELATED_ARTISTS            = 'ADD_RELATED_ARTISTS';
export const MARK_ARTISTS_AS_REJECTED       = 'MARK_ARTISTS_AS_REJECTED';
export const UPDATE_VERTEX_POSITIONS        = 'UPDATE_VERTEX_POSITIONS';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
// TEMPORARY. Just for development purposes.
import { vertexData } from '../temp_fixtures.js';
// const initialState = fromJS(vertexData);
const initialState = fromJS({
  vertices: [],
  edges: []
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case SETUP_INITIAL_STAGE:
    console.log("Setting up", action)
    const initialVertices = fromJS([{
      id:           action.artist.get('id'),
      name:         action.artist.get('name'),
      images:       action.artist.get('images'),
      region:       PRESENT,
      regionIndex:  1
    }])

    return state.set('vertices', initialVertices);

  case UPDATE_REPOSITION_STATUS:
    // TODO: Is this actually necessary?
    return state.set('status', action.status);

  case ADD_RELATED_ARTISTS:
    return state
      .update('vertices', vertices => {
        // Convert our Spotify artist stuff to vertices
        const newVertices = fromJS(action.artists.map( (artist, i) => ({
          id:           artist.id,
          name:         artist.name,
          images:       artist.images,
          region:       FUTURE,
          regionIndex:  i
        })));

        return vertices.concat(newVertices);
      })
      .update('edges', edges => {
        const from = state
          .get('vertices')
          .find( v => v.get('region') === PRESENT )
          .get('id');

        console.log("From", from)
        const newEdges = fromJS(action.artists.map( artist => ({
          from,
          to: artist.id
        })));

        return edges.concat(newEdges);
      })


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

export function addRelatedArtists(artists) {
  console.log("Action called with", artists.slice(0, 3))
  return {
    type: ADD_RELATED_ARTISTS,
    artists: artists.slice(0,3)
  };
}
