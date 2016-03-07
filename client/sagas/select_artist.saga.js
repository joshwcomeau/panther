import { takeEvery } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'

import {
  SELECT_ARTIST,
  setupInitialStage,
  markUnclickedArtistsAsRejected,
  retractRejectedNodeEdges,
  removeRejectedArtists,
  retractSelectedNodeEdge,
  positionSelectedArtistToCenter,
  populateRelatedArtistNodes,
  calculateAndExpandEdges,
  restorePreviousNodeState,
  takeSnapshotOfState
} from '../ducks/graph.duck';

import { repositionDelay, repositionLength } from '../config/timing';


// a utility function: return a Promise that will resolve after 1 second
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))



export function* initializeWithArtist(artist) {
  yield put(setupInitialStage(artist));

  // Fetch related artists
  const response = yield call( requestAPI, {
    endpoint: `artists/${artist.get('id')}/related-artists`
  });

  yield put(populateRelatedArtistNodes(response.artists));
  yield put(calculateAndExpandEdges());
}


export function* selectArtist(action) {
  if ( action.direction === 'forwards' ) {
    yield put(takeSnapshotOfState());
  }


  yield put(markUnclickedArtistsAsRejected(action.artist));
  yield put(retractRejectedNodeEdges());

  yield delay(repositionDelay);
  if ( action.direction === 'forwards' ) {
    yield put(removeRejectedArtists());
    yield put(retractSelectedNodeEdge());
    yield put(positionSelectedArtistToCenter());

    const response = yield call( requestAPI, {
      endpoint: `artists/${action.artist.get('id')}/related-artists`
    });

    yield put(populateRelatedArtistNodes(response.artists));

    yield delay(repositionLength);
    yield put(calculateAndExpandEdges());
  } else {
    yield put(restorePreviousNodeState());
    yield delay(repositionLength);
    yield put(calculateAndExpandEdges());
  }
}


// Our watcher Saga
export function* watchSelectArtist() {
  // The first time this action is triggered, the job is a bit different.
  // We're setting up the structure, not moving forward to the next nodes.
  // TODO: Some way of resetting this, so that the process can be restarted
  // without refreshing the page.
  const initialAction = yield take(SELECT_ARTIST);
  yield initializeWithArtist(initialAction.artist)

  yield* takeEvery(SELECT_ARTIST, selectArtist);
}


// HELPERS
// TODO: COnsolidate in a lib
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
