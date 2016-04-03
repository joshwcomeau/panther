import { Map, List, fromJS }    from 'immutable';

import { fetchRecentSearches }  from '../helpers/api.helpers';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const REQUEST_TYPEAHEAD_SUGGESTIONS  = 'REQUEST_TYPEAHEAD_SUGGESTIONS';
export const RECEIVE_TYPEAHEAD_SUGGESTIONS  = 'RECEIVE_TYPEAHEAD_SUGGESTIONS';
export const FAILURE_TYPEAHEAD_SUGGESTIONS  = 'FAILURE_TYPEAHEAD_SUGGESTIONS';
export const REQUEST_RECENT_SEARCHES        = 'REQUEST_RECENT_SEARCHES';
export const RECEIVE_RECENT_SEARCHES        = 'RECEIVE_RECENT_SEARCHES';
export const FAILURE_RECENT_SEARCHES        = 'FAILURE_RECENT_SEARCHES';
export const CLEAR_TYPEAHEAD                = 'CLEAR_TYPEAHEAD';


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

    case REQUEST_RECENT_SEARCHES:
      return state;

    case RECEIVE_RECENT_SEARCHES:
      return state.set('recent', action.recent);

    case CLEAR_TYPEAHEAD:
      return initialState;

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

export function requestRecentSearches() {
  return dispatch => {
    // Start by dispatching this action.
    // It's currently unused, but I may want to display something optimistic.
    dispatch({ type: REQUEST_RECENT_SEARCHES });

    fetchRecentSearches()
      .then( recentSearches => dispatch(receiveRecentSearches(recentSearches)) )
      .catch( err => dispatch(failureRecentSearches(err)) );
  };
}

export function receiveRecentSearches(recent) {
  return {
    type: RECEIVE_RECENT_SEARCHES,
    recent
  };
}

export function failureRecentSearches(error) {
  return {
    type: FAILURE_RECENT_SEARCHES,
    error
  }
}

export function clearTypeahead() {
  return {
    type: CLEAR_TYPEAHEAD
  }
}
