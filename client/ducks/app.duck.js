// This is a generic duck for all top-level app-related concerns
// (eg. moving between modes, actions affecting huge chunks of the app like resetting).
import { Map, List, fromJS } from 'immutable';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const UPDATE_MODE = 'UPDATE_MODE';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = fromJS({
  mode: null
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
  case UPDATE_MODE:
    return state.set('mode', action.mode)

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
