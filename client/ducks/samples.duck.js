import { Map, List, fromJS } from 'immutable';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const LOAD_TRACKS              = 'LOAD_TRACKS';
export const SELECT_ARTIST_FOR_TRACKS = 'SELECT_ARTIST_FOR_TRACKS';
export const UNLOAD_TRACKS            = 'UNLOAD_TRACKS';
export const PLAY_TRACK               = 'PLAY_TRACK';
export const STOP                     = 'STOP';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = fromJS({
  tracks: {},
  selectedArtistId: null,
  playing: null
});

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_TRACKS:
      return state.setIn(
        ['tracks', action.artistId],
        fromJS(action.tracks)
      );

    case SELECT_ARTIST_FOR_TRACKS:
     return state.set('selectedArtistId', action.artistId)

    case UNLOAD_TRACKS:
      return initialState;

    case PLAY_TRACK:
      return state.set('playing', action.trackId);

    case STOP:
      return state.set('playing', null);

    default:
      return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////

export function loadTracks(tracks, artistId) {
  tracks = tracks.slice(0, 3).map( track => ({
    id:   track.id,
    url:  track.preview_url,
    name: track.name,
    artistId
  }));

  return {
    type: LOAD_TRACKS,
    artistId,
    tracks
  };
}

export function selectArtistForTracks(artistId) {
  return {
    type: SELECT_ARTIST_FOR_TRACKS,
    artistId
  };
}

export function unloadTracks() {
  return { type: UNLOAD_TRACKS };
}

export function playTrack(trackId) {
  return {
    type: PLAY_TRACK,
    trackId
  }
}

export function stop() {
  return { type: STOP };
}
