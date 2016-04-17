import { takeEvery } from 'redux-saga'
import { take, call, put, select } from 'redux-saga/effects'
import { fromJS } from 'immutable';

import {
  SELECT_ARTIST,
  setupInitialStage,
  updateRepositionStatus,
  updateLoadingStatus,
  addRelatedArtistsToGraph,
  centerGraphAroundVertex,
  captureGraphState,
  restoreGraphState
} from '../ducks/graph.duck';
import { addArtists } from '../ducks/artists.duck';
import { loadTracks, stop } from '../ducks/samples.duck';
import { updateMode } from '../ducks/app.duck';
import { clearTypeahead } from '../ducks/search.duck';

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


// TODO: Error handling (what happens if the API calls fail?)

function* fetchRelatedArtistsAndTopTracks({ artistId, delayLength }) {
  // Make our API calls. We also want to add a small buffer to delayLength,
  // so that these calls perform their updates _after_ the graph animations are
  // complete)
  yield put(updateLoadingStatus(true));

  const [ related, top ] = yield [
    call( fetchRelatedArtists, artistId ),
    call( fetchTopTracks, artistId ),
    delay(delayLength + 50)
  ];

  const artistsInState = yield select( state => state.get('artists'));
  const first3Related = takeFirstFewUnseenArtists(related.artists, artistsInState);

  yield [
    put(addArtists(first3Related)),
    put(addRelatedArtistsToGraph(first3Related)),
    put(loadTracks(top.tracks))
  ];

  yield put(updateLoadingStatus(false));
}


function* initializeWithArtist(artist) {
  const artistId = artist.get('id');

  // It's possible we don't have all the info we need yet;
  // If the user came to a specific URL, all we have is the ID.
  const artistDataLoaded = artist.get('type') === 'artist';

  if ( !artistDataLoaded ) {
    yield put(updateLoadingStatus(true));

    const [ artistData, top ] = yield [
      call( fetchArtistInfo, artistId ),
      call( fetchTopTracks, artistId )
    ];

    put(loadTracks(top.tracks));

    artist = fromJS(artistData);
  }

  yield put(updateMode('graph'));
  yield put(captureGraphState());
  yield put(updateLoadingStatus(true));

  yield put(updateRepositionStatus(false));

  // Wait half a second for the "search" component to fade away
  if ( artistDataLoaded ) yield delay(500);

  yield [
    put(addArtists(artist)),
    put(setupInitialStage(artist))
  ];
  // Wait for the artist node to fade in, and the avatar to pop up.
  yield delay(vertexEnterLength);

  // Clear the typeahead, in case the user goes back to search
  yield put(clearTypeahead());

  yield fetchRelatedArtistsAndTopTracks({
    artistId,
    delayLength: 0
  });
}

export function* progressWithArtist(artist) {
  yield [
    put(captureGraphState()),
    put(stop())
  ];

  yield put(centerGraphAroundVertex(artist));

  yield fetchRelatedArtistsAndTopTracks({
    artistId: artist.get('id'),
    delayLength: repositionDelay + repositionLength
  });
}

// Our watcher Saga
export function* watchSelectArtist() {
  while (true) {
    const action = yield take(SELECT_ARTIST);

    // Figure out if the board is already set up, or if this is our initial artist.
    // On first invocation, from the search form or from a direct URL, our role is
    // different. We need to add our first node to the board.
    // For subsequent invocations, the job is different: Shifting everything down
    // one position.
    const appMode = yield select( state => state.getIn(['app', 'mode']));
    const isInitialArtist = appMode !== 'graph';
    const artist = action.artist;

    yield isInitialArtist ? initializeWithArtist(artist) : progressWithArtist(artist);
  }
}
