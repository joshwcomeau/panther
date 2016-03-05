import { Map, List, fromJS } from 'immutable';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
const RETRIEVE_TYPEAHEAD_SUGGESTIONS = 'RETRIEVE_TYPEAHEAD_SUGGESTIONS';
const CLEAR_TYPEAHEAD = 'CLEAR_TYPEAHEAD';
const RECORD_VOICE = 'RECORD_VOICE';
const SELECT_TYPEAHEAD_SUGGESTION = 'SELECT_TYPEAHEAD_SUGGESTION';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = Map();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RETRIEVE_TYPEAHEAD_SUGGESTIONS:
      break;

    case CLEAR_TYPEAHEAD:
      // TODO: display some random artist names for inspiration
      break;

    case RECORD_VOICE:
      break;

    case SELECT_TYPEAHEAD_SUGGESTION:
      break;

    default:
      return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////

export function retrieveTypeaheadSuggestions(artistName) {
  // TODO: API middleware
  return {
    type: RETRIEVE_TYPEAHEAD_SUGGESTIONS,
    meta: {
      api: {
        findArtist: artistName
      }
    }
  }
}

export function clearTypeahead() {
  return {
    type: CLEAR_TYPEAHEAD
  }
}

export function recordVoice() {
  // TODO: Figure this out
  return {
    type: RECORD_VOICE
  };
}

export function selectTypeaheadSuggestion() {
  // This will basically just hide the intro stuff so the graph can take over.
  // We'll need, ideally in the component, a second action dispatched to
  // go to the graph reducer.

  return {
    type: SELECT_TYPEAHEAD_SUGGESTION
  };
}
