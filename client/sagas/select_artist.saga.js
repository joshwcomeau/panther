import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import {
  SELECT_ARTIST,
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


// When we click a node, a bunch of stuff needs to happen:
//   - immediately fade out the NON-clicked nodes, over N1 ms.
//   - immediately fetch the artist info from Spotify.
//   - immediately fetch the artist's related artists.
//   - after N1ms, reposition the nodes so that the clicked one is centered.
//      this action should take N2ms
//   - after N1+N2ms, IF the artist info is available, show the artist data.
//     If not, wait until it is and then perform immediately.

// Our worker saga. It does the actual orchestration
export function* selectArtist(action) {
  if ( action.direction === 'forwards' ) {
    yield put(takeSnapshotOfState());
  }

  yield put(markUnclickedArtistsAsRejected(action.node));
  yield put(retractRejectedNodeEdges());

  yield delay(repositionDelay);
  if ( action.direction === 'forwards' ) {
    yield put(removeRejectedArtists());
    yield put(retractSelectedNodeEdge());
    yield put(positionSelectedArtistToCenter());
    yield put(populateRelatedArtistNodes());

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
  yield* takeEvery(SELECT_ARTIST, selectArtist);
}
