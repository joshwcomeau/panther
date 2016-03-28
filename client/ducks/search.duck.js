import { Map, List, fromJS } from 'immutable';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const REQUEST_TYPEAHEAD_SUGGESTIONS = 'REQUEST_TYPEAHEAD_SUGGESTIONS';
const RECEIVE_TYPEAHEAD_SUGGESTIONS = 'RECEIVE_TYPEAHEAD_SUGGESTIONS';
const FAILURE_TYPEAHEAD_SUGGESTIONS = 'FAILURE_TYPEAHEAD_SUGGESTIONS';
const CLEAR_TYPEAHEAD = 'CLEAR_TYPEAHEAD';
const RECORD_VOICE = 'RECORD_VOICE';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = Map({
  term: ''
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TYPEAHEAD_SUGGESTIONS:
      return state
        .set('term', fromJS(action.term))
        .set('loading', true);

    case RECEIVE_TYPEAHEAD_SUGGESTIONS:
      return state
        .set('suggestions', fromJS(action.artists))
        .set('loading', false);

    case FAILURE_TYPEAHEAD_SUGGESTIONS:
      return state;

    case CLEAR_TYPEAHEAD:
      return initialState;

    case RECORD_VOICE:
      return state;

    default:
      return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////

export function requestTypeaheadSuggestions(term) {
  return {
    type: REQUEST_TYPEAHEAD_SUGGESTIONS,
    term
  };
}

export function receiveTypeaheadSuggestions(suggestedArtists) {
  return {
    type: RECEIVE_TYPEAHEAD_SUGGESTIONS,
    artists: suggestedArtists
  };
}

export function failureTypeaheadSuggestions(error) {
  return {
    type: FAILURE_TYPEAHEAD_SUGGESTIONS,
    error
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
