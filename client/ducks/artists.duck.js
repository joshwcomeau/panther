import { Map, List, fromJS } from 'immutable';
import isArray from 'lodash/isArray';

///////////////////////////
// DUCK INFO /////////////
/////////////////////////
// This duck contains a cache of all the artists we've fetched.
// Our graph vertices keep an `artistId` that references one of the items here.
// It's one big key/value store, with the keys being the artistId, and the
// values being the pertinent artist info (name, images).
// eg:
//    {
//      abc123: { name: 'deadmau5', images: [...] },
//      xyz789: { name: 'Wolfgang Gartner', images: [...] }
//    }


///////////////////////////
// ACTION TYPES //////////
/////////////////////////
export const ADD_ARTISTS = 'ADD_ARTISTS';


///////////////////////////
// REDUCER ///////////////
/////////////////////////
const initialState = Map();

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ADD_ARTISTS:
      // TODO: Make it an LRU cache, so it doesn't grow infinitely large?

      // Allow a single artist to be passed in.
      if ( !isArray(action.artists) ) {
        action.artists = [action.artists];
      }

      action.artists.forEach( artist => {
        const artistId = artist.get ? artist.get('id') : artist.id
        state = state.set(artistId, fromJS(artist));
      });

      return state;

    default:
      return state;
  }
}


///////////////////////////
// ACTION CREATORS ///////
/////////////////////////

export function addArtists(artists) {
  return {
    type: ADD_ARTISTS,
    artists
  };
}
