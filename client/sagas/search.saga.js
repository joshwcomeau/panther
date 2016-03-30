import { take, call, put } from 'redux-saga/effects';

import { fetchSearchResults } from '../helpers/api.helpers';
import {
  REQUEST_TYPEAHEAD_SUGGESTIONS,
  receiveTypeaheadSuggestions
} from '../ducks/search.duck';


export function* search() {
  while (true) {
    const action = yield take(REQUEST_TYPEAHEAD_SUGGESTIONS);

    const response = yield call( fetchSearchResults, action.term );

    const suggestedArtists = response.artists.items.slice(0,8);
    yield put(receiveTypeaheadSuggestions(suggestedArtists))
  }
}
