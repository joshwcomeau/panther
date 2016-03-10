import { Map, List, fromJS } from 'immutable';
import isBoolean from 'lodash/isBoolean';

///////////////////////////
// ACTION TYPES //////////
/////////////////////////
const TOGGLE_ARTIST = 'TOGGLE_ARTIST';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = fromJS({
  artistVisible: false
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_ARTIST:
      // Set the new state to the value provided, or just the opposite of what
      // it currently is, if no value is provided.
      const newState  = isBoolean(action.newState)
                        ? action.newState
                        : !state.get('artistVisible')

      return state.set('artistVisible', newState);

    default:
      return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////

export function toggleArtist(newState) {
  return {
    type: TOGGLE_ARTIST,
    newState
  };
}
