import toPairs from 'lodash/toPairs';
import throttle from 'lodash/throttle';


const spotify = store => next => action => {
  // This middleware depends on `fetch` and promises being available.

  // ignore non-spotify actions
  if ( !action.meta || !action.meta.spotify ) return next(action);

  // Send the action immediately on to the reducer, for any optimistic stuff.
  next(action);

  const { endpoint, params} = action.meta.spotify;

  const paramString = toPairs(params).map(param => param.join('=')).join('&');


  const url = `https://api.spotify.com/v1/${endpoint}?${paramString}`;

  fetchFromSpotify(url, action, next);

};

const fetchFromSpotify = throttle((url, action, next) => {
  fetch(url)
    .then(checkStatus)
    .then( response => response.json() )
    .then( data => {
      const artists = data.artists.items.slice(0, 8);
      next(action.meta.spotify.onSuccess(artists));
    })
    .catch( err => {
      next(action.meta.spotify.onFailure(err));
    });
}, 500)

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

export default spotify
