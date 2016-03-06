import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'

import {
  INITIALIZE_WITH_ARTIST
} from '../ducks/graph.duck';


// a utility function: return a Promise that will resolve after 1 second
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))


export function* initializeWithArtist(action) {
  // We already have the artist info, we just need to fetch related ones
  console.log("Init action", action);
}

// Our watcher Sagas
export function* watchInitializeWithArtist() {
  console.log("Watching for initialize")
  yield* takeEvery(INITIALIZE_WITH_ARTIST, initializeWithArtist);
}
