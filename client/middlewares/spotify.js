import toPairs from 'lodash/toPairs';

const spotify = store => next => action => {
  // This middleware depends on `fetch` and promises being available.

  // ignore non-spotify actions
  if ( !action.meta || !action.meta.spotify ) return next(action);

  // Send the action immediately on to the reducer, for any optimistic stuff.
  next(action);

  const { endpoint, params} = action.meta.spotify;

  const paramString = toPairs(params).map(param => param.join('=')).join('&');


  const url = `https://api.spotify.com/v1/${endpoint}?${paramString}`;

  fetch(url)
    .then(checkStatus)
    .then( response => response.json() )
    .then( data => {
      const artists = data.artists.items.slice(0, 8);
      console.log("Got data", data)
      next(action.meta.spotify.onSuccess(artists));
    })
    .catch( err => {
      console.log("Oh no!", err);
      next(action.meta.spotify.onFailure(err));
    });
};

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
