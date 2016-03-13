import { takeEvery } from 'redux-saga'
import { take, call, put } from 'redux-saga/effects'

import {
  SELECT_ARTIST,
  setupInitialStage,
  updateRepositionStatus,
  addRelatedArtistsToGraph,
  markArtistsAsRejected,
  centerGraphAroundVertex
} from '../ducks/graph.duck';
import { addArtists } from '../ducks/artists.duck';
import { loadTracks, stop } from '../ducks/samples.duck';
import { fetchRelatedArtists, fetchTopTracks } from '../helpers/api.helpers';
import { repositionDelay, repositionLength } from '../config/timing';


// a utility function: return a Promise that will resolve after 1 second
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))



export function* initializeWithArtist(artist) {
  yield [
    put(addArtists(artist)),
    put(setupInitialStage(artist)),
    put(updateRepositionStatus('setup'))
  ];

  // Fetch related artists
  const [ related, top ] = yield [
    call( fetchRelatedArtists, artist.get('id') ),
    call( fetchTopTracks, artist.get('id') )
  ];

  // TODO: We want to avoid showing related artists that we've already seen.
  // Use Select to query the store's state, and use it to figure out which
  // first 3 artists we can use of the ones returned by Spotify
  // http://yelouafi.github.io/redux-saga/docs/api/index.html#selectselector-args
  // For now I'm just taking the first 3
  const first3Related = related.artists.slice(0, 3);

  yield [
    put(addArtists(first3Related)),
    put(addRelatedArtistsToGraph(first3Related)),
    put(loadTracks(top.tracks))
  ];
}


export function* selectArtist(action) {
  // We've selected an artist, which means the state needs to change in
  // a few ways.
  const artistId = action.artist.get('id');

  put(centerGraphAroundVertex(action.artist))


  // if ( action.direction === 'forwards' ) {
  //   yield put(takeSnapshotOfState());
  // }
  //
  // yield [
  //   put(toggleArtist(false)),
  //   put(markUnclickedArtistsAsRejected(action.artist)),
  //   put(stop())
  // ];
  //
  // yield put(retractRejectedNodeEdges());
  //
  // yield delay(repositionDelay);
  // if ( action.direction === 'forwards' ) {
  //   yield put(removeRejectedArtists());
  //
  //   yield [
  //     put(retractSelectedNodeEdge()),
  //     put(positionSelectedArtistToCenter())
  //   ];
  //
  //   const [ related, top ] = yield [
  //     call( fetchRelatedArtists, action.artist.get('id') ),
  //     call( fetchTopTracks, action.artist.get('id') )
  //   ];
  //
  //   yield put(populateRelatedArtistNodes(related.artists));
  //   yield put(loadTracks(top.tracks));
  //
  // } else {
  //   yield put(restorePreviousNodeState());
  // }
  //
  // yield delay(repositionLength);
  // yield put(calculateAndExpandEdges());
  // yield put(toggleArtist(true));
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
