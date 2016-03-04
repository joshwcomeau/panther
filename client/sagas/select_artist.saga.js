import { takeEvery } from 'redux-saga'
import { put } from 'redux-saga/effects'

import {
  SELECT_ARTIST,
  markUnclickedArtistsAsRejected,
  fadeAndRemoveNodes,
  positionSelectedArtistToCenter,
  retractEdges,
  calculateAndExpandEdges
} from '../ducks/graph.duck';


// a utility function: return a Promise that will resolve after 1 second
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


// TIMING VARIABLES
// TODO: Find some central place to store these, ideally which can populate
// the CSS durations as well.
const delayBeforeRepositionMs = 500;
const rejectedFadeOutMs       = 700; // Change this one in nodes.scss!!
const repositionMs            = 1000;
const edgesRetractMs          = 250;
const edgesExpandMs           = 550;

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
  yield put(markUnclickedArtistsAsRejected(action.node));
  yield put(retractEdges())

  yield delay(delayBeforeRepositionMs);
  yield put(positionSelectedArtistToCenter());

  yield delay(repositionMs);
  yield put(calculateAndExpandEdges());
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchSelectArtist() {
  yield* takeEvery(SELECT_ARTIST, selectArtist)
}
