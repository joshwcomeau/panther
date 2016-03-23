import { takeEvery } from 'redux-saga'
import { take, call, put, select } from 'redux-saga/effects'
import { fromJS } from 'immutable';

import {
  SELECT_ARTIST,
  setupInitialStage,
  updateRepositionStatus,
  addRelatedArtistsToGraph,
  centerGraphAroundVertex,
  captureGraphState,
  restoreGraphState
} from '../ducks/graph.duck';
import { addArtists } from '../ducks/artists.duck';
import { loadTracks, stop } from '../ducks/samples.duck';

import { takeFirstFewUnseenArtists } from '../helpers/artists.helpers';
import {
  fetchRelatedArtists,
  fetchTopTracks,
  fetchArtistInfo
} from '../helpers/api.helpers';
import {
  repositionDelay, repositionLength,
  edgesExpandLength, vertexEnterLength,
  artistAvatarLength, artistAvatarDelay
} from '../config/timing';


// a utility function: return a Promise that will resolve after 1 second
export const delay = ms => new Promise(resolve => setTimeout(resolve, ms))



function* fetchRelatedArtistsAndTopTracks({ artistId, delayLength }) {
  // Fetch related artists
  const [ related, top ] = yield [
    call( fetchRelatedArtists, artistId ),
    call( fetchTopTracks, artistId ),
    delay(delayLength + 100) // Adding a 100ms buffer, because JS isn't instant.
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
  // It's possible we don't have all the info we need yet;
  // If the user came to a specific URL, all we have is the ID.
  if ( artist.get('type') !== 'artist' ) {
    const artistData = yield call( fetchArtistInfo, artist.get('id') );
    // TODO: Error handling (what happens if the API call fails?);
    artist = fromJS(artistData);
  }

  yield put(captureGraphState());
  yield put(updateRepositionStatus('idle'));

  // Wait half a second for the "search" component to fade away
  yield delay(500);

  yield [
    put(addArtists(artist)),
    put(setupInitialStage(artist))
  ];
  // Wait for the artist node to fade in, and the avatar to pop up.
  yield delay(vertexEnterLength);

  yield fetchRelatedArtistsAndTopTracks({
    artistId: artist.get('id'),
    delayLength: 0
  });
}


export function* selectArtist(action) {
  yield put(captureGraphState());

  yield put(centerGraphAroundVertex(action.artist));

  yield fetchRelatedArtistsAndTopTracks({
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
