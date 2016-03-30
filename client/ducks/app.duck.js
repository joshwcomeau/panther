// This is a generic duck for all top-level app-related concerns
// (eg. moving between modes, actions affecting huge chunks of the app like resetting).
import { Map, List, fromJS } from 'immutable';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const UPDATE_MODE        = 'UPDATE_MODE';
export const UPDATE_ARTIST_URL  = 'UPDATE_ARTIST_URL';
export const RESTART            = 'RESTART';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = fromJS({
  mode: null
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_MODE:
    return state.set('mode', action.mode);

  case RESTART:
    // This action delegates to a saga. Has no direct result on state.
    return state;

  case UPDATE_ARTIST_URL:
    // This action delegates to a saga. Has no direct result on state.
    return state;

  default:
    return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////
export function updateMode(mode) {
  return {
    type: UPDATE_MODE,
    mode
  };
}

export function restart() {
  return { type: RESTART };
}

export function updateArtistUrl(artistId) {
  return {
    type: UPDATE_ARTIST_URL,
    meta: {
      history: {
        type: 'push',
        path: `/artist/${artistId}`
      }
    }
  }
}
