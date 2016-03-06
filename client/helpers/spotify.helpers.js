import throttle from 'lodash/throttle';
import toPairs from 'lodash/toPairs';


const ROOT_URL = 'https://api.spotify.com/v1';

export const spotifyRequest = throttle(
  ({ endpoint, params, onSuccess, onFailure }) => {
    const paramString = toPairs(params).map(param => param.join('=')).join('&');
    const url = `${ROOT_URL}/${endpoint}?${paramString}`;

    fetch(url)
      .then(checkStatus)
      .then( response => response.json() )
      .then( onSuccess )
      .catch( onFailure );
  }, 500
);

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}
