import { Map, List, fromJS } from 'immutable';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
const REQUEST_TYPEAHEAD_SUGGESTIONS = 'REQUEST_TYPEAHEAD_SUGGESTIONS';
const RECEIVE_TYPEAHEAD_SUGGESTIONS = 'RECEIVE_TYPEAHEAD_SUGGESTIONS';
const FAILURE_TYPEAHEAD_SUGGESTIONS = 'FAILURE_TYPEAHEAD_SUGGESTIONS';
const CLEAR_TYPEAHEAD = 'CLEAR_TYPEAHEAD';
const RECORD_VOICE = 'RECORD_VOICE';
const SELECT_TYPEAHEAD_SUGGESTION = 'SELECT_TYPEAHEAD_SUGGESTION';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = Map({
  value: 'ya'
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REQUEST_TYPEAHEAD_SUGGESTIONS:
      return state.set('term', fromJS(action.term));

    case RECEIVE_TYPEAHEAD_SUGGESTIONS:
      return state.set('suggestions', fromJS(action.artists));

    case FAILURE_TYPEAHEAD_SUGGESTIONS:
      return state;

    case CLEAR_TYPEAHEAD:
      // TODO: display some random artist names for inspiration
      return state;

    case RECORD_VOICE:
      return state;

    case SELECT_TYPEAHEAD_SUGGESTION:
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
    term,
    meta: {
      spotify: {
        endpoint: 'search',
        params: {
          type: 'artist',
          q: term
        },
        onSuccessAction: receiveTypeaheadSuggestions,
        onFailureAction: failureTypeaheadSuggestions
      }
    }
  };
}

export function receiveTypeaheadSuggestions(suggestions) {
  return {
    type: RECEIVE_TYPEAHEAD_SUGGESTIONS,
    artists: suggestions.artists.items.slice(0, 10)
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

export function selectTypeaheadSuggestion() {
  // This will basically just hide the intro stuff so the graph can take over.
  // We'll need, ideally in the component, a second action dispatched to
  // go to the graph reducer.

  return {
    type: SELECT_TYPEAHEAD_SUGGESTION
  };
}
