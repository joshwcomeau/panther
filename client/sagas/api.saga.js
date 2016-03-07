import { takeEvery } from 'redux-saga';
import { take, call, put } from 'redux-saga/effects';
import toPairs from 'lodash/toPairs';


import {
  REQUEST_TYPEAHEAD_SUGGESTIONS,
  receiveTypeaheadSuggestions
} from '../ducks/search.duck';





export function* search() {
  while (true) {
    const action = yield take(REQUEST_TYPEAHEAD_SUGGESTIONS);

    const response = yield call( requestAPI, {
      endpoint: 'search',
      params: {
        type: 'artist',
        q: action.term
      }
    });

    const suggestedArtists = response.artists.items.slice(0,8);
    yield put(receiveTypeaheadSuggestions(suggestedArtists))
  }
  // yield call()
}


// HELPERS
function requestAPI({endpoint, params}) {
  let url = `https://api.spotify.com/v1/${endpoint}`;

  if ( params ) {
    const paramString = toPairs(params).map(param => param.join('=')).join('&');
    url += `?${paramString}`;
  }

  return fetch(url).then(checkStatus).then( response => response.json() );
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
