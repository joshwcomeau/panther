import { takeEvery } from 'redux-saga'
import { take, call, put, select } from 'redux-saga/effects'

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

import { takeFirstFewUnseenArtists } from '../helpers/artists.helpers';
import { fetchRelatedArtists, fetchTopTracks } from '../helpers/api.helpers';
import { repositionDelay, repositionLength } from '../config/timing';


// a utility function: return a Promise that will resolve after 1 second
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))



function* fetchArtistAndTrackInfo({ artistId, delayLength }) {
  // Fetch related artists
  const [ related, top ] = yield [
    call( fetchRelatedArtists, artistId ),
    call( fetchTopTracks, artistId ),
    delay(delayLength)
  ];

  const artistsInState = yield select( state => state.get('artists'));
  const first3Related = takeFirstFewUnseenArtists(related.artists, artistsInState);

  yield [
    put(addArtists(first3Related)),
    put(addRelatedArtistsToGraph(first3Related)),
    put(loadTracks(top.tracks))
  ];

}


function* initializeWithArtist(artist) {
  yield [
    put(addArtists(artist)),
    put(setupInitialStage(artist)),
    put(updateRepositionStatus('setup'))
  ];

  yield fetchArtistAndTrackInfo({
    artistId: artist.get('id'),
    delayLength: 0
  });
}


export function* selectArtist(action) {
  yield put(centerGraphAroundVertex(action.artist));
  yield fetchArtistAndTrackInfo({
    artistId: action.artist.get('id'),
    delayLength: repositionDelay + repositionLength
  });
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
