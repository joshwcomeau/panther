import { Map, List, fromJS } from 'immutable';


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
const LOAD_TRACKS = 'LOAD_TRACKS';
const PLAY_TRACK  = 'PLAY_TRACK';
const STOP        = 'STOP';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = fromJS({
  tracks: [],
  playing: null
});

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_TRACKS:
      return state.set('tracks', fromJS(action.tracks));

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

export function loadTracks(tracks) {
  // We want to extract the pertinent info from the spotify dump
  tracks = tracks.slice(0, 3).map( track => ({
    id:       track.id,
    url:      track.preview_url,
    name:     track.name
  }));

  return {
    type: LOAD_TRACKS,
    tracks
  };
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
